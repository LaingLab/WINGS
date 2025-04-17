import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import { ipcMain } from 'electron'
import ffmpeg from 'fluent-ffmpeg'
import * as fs from 'fs'
import { createWriteStream } from 'fs'
import * as path from 'path'
import { FILE_DIR } from './file'

ffmpeg.setFfmpegPath(ffmpegPath.path)

const activeRecordings = new Map()

export function setupVideoHandlers() {
  ipcMain.handle('video:start-recording', (_, { fileName, outputFolder, format = 'webm' }) => {
    try {
      const outputDirectory = outputFolder || FILE_DIR

      if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory, { recursive: true })
      }

      const actualFileName = fileName || `recording-${Date.now()}`
      const finalFilePath = path.join(
        outputDirectory,
        actualFileName.includes(`.${format}`) ? actualFileName : `${actualFileName}.${format}`
      )

      const tempFilePath = path.join(outputDirectory, `temp-${Date.now()}.webm`)
      const fileStream = createWriteStream(tempFilePath)

      const recordingId = Date.now().toString()
      activeRecordings.set(recordingId, {
        fileStream,
        tempFilePath,
        finalFilePath,
        format,
        chunks: 0
      })

      console.log(`Started recording to ${tempFilePath} (will convert to ${format})`)
      return { recordingId, filePath: finalFilePath }
    } catch (error) {
      console.error('Failed to start recording:', error)
      throw error
    }
  })

  ipcMain.handle('video:write-chunk', async (_, { recordingId, chunk }) => {
    try {
      const recording = activeRecordings.get(recordingId)
      if (!recording) {
        throw new Error(`No active recording found with ID ${recordingId}`)
      }

      const buffer = Buffer.from(chunk)
      recording.fileStream.write(buffer)
      recording.chunks++

      return { success: true, chunksWritten: recording.chunks }
    } catch (error) {
      console.error('Failed to write video chunk:', error)
      throw error
    }
  })

  ipcMain.handle('video:stop-recording', async (_, { recordingId }) => {
    try {
      const recording = activeRecordings.get(recordingId)
      if (!recording) {
        throw new Error(`No active recording found with ID ${recordingId}`)
      }

      recording.fileStream.end()

      if (recording.format !== 'webm') {
        console.log(`Converting WebM to ${recording.format}...`)

        return new Promise((resolve, reject) => {
          ffmpeg(recording.tempFilePath)
            .outputOptions('-c:v libx264') // H.264 codec
            .output(recording.finalFilePath)
            .on('end', () => {
              console.log('Conversion finished')

              // Remove temp file
              fs.unlink(recording.tempFilePath, (err) => {
                if (err) console.error('Error removing temp file:', err)
              })

              const result = {
                success: true,
                filePath: recording.finalFilePath,
                totalChunks: recording.chunks
              }

              activeRecordings.delete(recordingId)

              resolve(result)
            })
            .on('error', (err) => {
              console.error('Error converting video:', err)
              reject(err)
            })
            .run()
        })
      } else {
        const result = {
          success: true,
          filePath: recording.tempFilePath,
          totalChunks: recording.chunks
        }

        activeRecordings.delete(recordingId)

        console.log(`Finished recording to ${recording.tempFilePath} (${recording.chunks} chunks)`)
        return result
      }
    } catch (error) {
      console.error('Failed to stop recording:', error)
      throw error
    }
  })
}
