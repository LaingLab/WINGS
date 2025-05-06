import { defaultTrialData, defaultTrialInfo } from '@shared/constants'
import { TrialData, TrialInfo, TrialResults } from '@shared/models'
import { atom } from 'jotai'

// Trial Atoms
export const trialInfoAtom = atom<TrialInfo>(defaultTrialInfo)
export const tempTrialInfoAtom = atom<TrialInfo>(defaultTrialInfo)
export const trialSettingsAtom = atom<TrialInfo['settings']>((get) => {
  const trialInfo = get(trialInfoAtom)
  return trialInfo.settings
})

// Trial Data Atoms
export const trialDataAtom = atom<TrialData>(defaultTrialData)

// Trial Results Atoms
export const trialResultsAtom = atom<TrialResults | null>(null)

// Video Atoms
export const isRecordingAtom = atom(false)
export const outputPathAtom = atom(null)
export const selectedMediaDeviceAtom = atom<string | null>(null)
