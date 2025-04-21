export const VideoActions = () => {
  return (
    <div>
      {/* Actions */}
      <div>
        <div className="bg-bg1 flex w-96 flex-col gap-3 rounded-xl border border-white/20 p-4">
          <button
            className="rounded-md border border-white/20 bg-neutral-800 px-4 py-2 text-white duration-150 hover:bg-neutral-800/50"
            onClick={handleSelectOutputFolder}
            disabled={isRecording}
          >
            Choose Save Location
          </button>
          <div className="flex gap-2">
            {!isRecording ? (
              <button
                className="w-full rounded-md border border-white/20 bg-green-700 px-4 py-2 text-white duration-150 hover:bg-green-700/50"
                onClick={handleStartRecording}
              >
                Start Recording
              </button>
            ) : (
              <button
                className="w-full rounded border border-white/20 bg-red-500 px-4 py-2 text-white duration-150 hover:bg-red-500/50"
                onClick={handleStopRecording}
              >
                Stop Recording
              </button>
            )}
          </div>
        </div>
        {outputPath && (
          <p className="w-96 p-5 text-sm break-all text-white">
            <strong>Saving to:</strong> {JSON.stringify(outputPath)}
          </p>
        )}
      </div>
    </div>
  )
}
