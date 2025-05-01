import * as fs from 'fs'
import * as path from 'path'

import { ipcMain } from 'electron'
import { createWriteStream, WriteStream } from 'fs'
import { FILE_DIR } from './file'

interface ActiveRecording {
  fileStream: WriteStream
  filePath: string
  chunksWritten: number
}

const activeRecordings = new Map<string, ActiveRecording>()

export function setupVideoHandlers() {
  ipcMain.handle('video:start-recording', async () => {
    try {
      const outputDirectory = FILE_DIR
      if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory, { recursive: true })
      }

      const recordingId = `rec-${Date.now()}`
      // Use a consistent naming scheme, directly saving as webm
      const filePath = path.join(outputDirectory, `${recordingId}.webm`)
      const fileStream = createWriteStream(filePath)

      activeRecordings.set(recordingId, {
        fileStream,
        filePath,
        chunksWritten: 0
      })

      console.log(`[Video] Started recording: ${filePath}`)
      return { recordingId, filePath }
    } catch (error) {
      console.error('[Video] Failed to start recording:', error)
      // Re-throw the error to ensure the promise rejects correctly
      throw error
    }
  })

  ipcMain.handle('video:write-chunk', async (_, { recordingId, chunk }) => {
    const recording = activeRecordings.get(recordingId)
    if (!recording) {
      console.error(`[Video] Write chunk failed: No recording found with ID ${recordingId}`)
      throw new Error(`No active recording found with ID ${recordingId}`)
    }

    try {
      const buffer = Buffer.from(chunk) // Ensure chunk is a Buffer
      await new Promise<void>((resolve, reject) => {
        recording.fileStream.write(buffer, (err) => {
          if (err) {
            console.error('[Video] Error writing video chunk:', err)
            reject(err)
          } else {
            recording.chunksWritten++
            resolve()
          }
        })
      })
      return { success: true, chunksWritten: recording.chunksWritten }
    } catch (error) {
      console.error('[Video] Failed to write video chunk:', error)
      // Consider how to handle write errors, maybe stop recording?
      // Re-throw the error
      throw error
    }
  })

  ipcMain.handle('video:stop-recording', async (_, { recordingId }) => {
    const recording = activeRecordings.get(recordingId)
    if (!recording) {
      console.error(`[Video] Stop recording failed: No recording found with ID ${recordingId}`)
      throw new Error(`No active recording found with ID ${recordingId}`)
    }

    try {
      await new Promise<void>((resolve) => {
        recording.fileStream.end(() => {
          console.log(`[Video] Finalized recording: ${recording.filePath}`)
          resolve()
        })
      })

      const finalFilePath = recording.filePath
      const totalChunks = recording.chunksWritten
      activeRecordings.delete(recordingId)

      console.log(`[Video] Recording stopped. Path: ${finalFilePath}, Chunks: ${totalChunks}`)
      return { success: true, filePath: finalFilePath, totalChunks }
    } catch (error) {
      console.error('[Video] Failed to stop recording:', error)
      // Attempt cleanup even on error
      if (activeRecordings.has(recordingId)) {
        try {
          recording.fileStream.close() // Ensure stream is closed
        } catch (closeError) {
          console.error('[Video] Error closing stream during failed stop:', closeError)
        }
        activeRecordings.delete(recordingId)
      }
      // Re-throw the error
      throw error
    }
  })
}
