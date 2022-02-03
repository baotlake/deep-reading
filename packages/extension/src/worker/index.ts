
import { handleMessage } from '../service'

chrome.runtime.onMessage.addListener(handleMessage)
