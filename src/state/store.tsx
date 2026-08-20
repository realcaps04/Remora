import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import { activity as seedActivity, devices as seedDevices, quickActions as seedQuick, rooms as seedRooms, scenes as seedScenes } from '../data/mock'
import { defaultDeviceState } from '../data/defaults'
import { commandLabel, sendCommand as dispatchHardware } from '../services/deviceController'
import { haptic } from '../lib/haptics'
import type {
  ActivityEvent,
  CommandPayload,
  ConnectionType,
  Device,
  DeviceType,
  FeedbackKind,
  ProductRequest,
  QuickAction,
  Room,
  Route,
  Scene,
  Tab,
} from '../types'

type Settings = {
  notifications: boolean
  haptics: boolean
  sound: boolean
  theme: 'dark' | 'light'
  defaultRemote: string | null
}

type State = {
  stack: Route[]
  rooms: Room[]
  devices: Device[]
  scenes: Scene[]
  activity: ActivityEvent[]
  quickActions: QuickAction[]
  requests: ProductRequest[]
  settings: Settings
  executingSceneId: string | null
  searchQuery: string
}

type Action =
  | { type: 'push'; route: Route }
  | { type: 'replace'; route: Route }
  | { type: 'back' }
  | { type: 'tab'; tab: Tab }
  | { type: 'patchDevice'; id: string; patch: Partial<Device> }
  | { type: 'setDevice'; device: Device }
  | { type: 'removeDevice'; id: string }
  | { type: 'addDevice'; device: Device }
  | { type: 'addRoom'; room: Room }
  | { type: 'moveDevice'; deviceId: string; roomId: string }
  | { type: 'toggleFavorite'; id: string }
  | { type: 'toggleSceneFavorite'; id: string }
  | { type: 'toggleQuickFavorite'; id: string }
  | { type: 'addActivity'; event: ActivityEvent }
  | { type: 'addRequest'; request: ProductRequest }
  | { type: 'setExecutingScene'; id: string | null }
  | { type: 'patchSettings'; patch: Partial<Settings> }
  | { type: 'setSearch'; query: string }

const initial: State = {
  stack: [{ name: 'splash' }],
  rooms: seedRooms,
  devices: seedDevices,
  scenes: seedScenes,
  activity: seedActivity,
  quickActions: seedQuick,
  requests: [],
  executingSceneId: null,
  searchQuery: '',
  settings: {
    notifications: true,
    haptics: true,
    sound: false,
    theme: 'dark',
    defaultRemote: null,
  },
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'push':
      return { ...state, stack: [...state.stack, action.route] }
    case 'replace':
      return { ...state, stack: [action.route] }
    case 'back': {
      if (state.stack.length <= 1) return { ...state, stack: [{ name: 'home' }] }
      return { ...state, stack: state.stack.slice(0, -1) }
    }
    case 'tab': {
      const route: Route =
        action.tab === 'home'
          ? { name: 'home' }
          : action.tab === 'devices'
            ? { name: 'devices' }
            : { name: 'settings' }
      return { ...state, stack: [route] }
    }
    case 'patchDevice':
      return {
        ...state,
        devices: state.devices.map((d) =>
          d.id === action.id ? { ...d, ...action.patch } : d,
        ),
      }
    case 'setDevice':
      return {
        ...state,
        devices: state.devices.map((d) => (d.id === action.device.id ? action.device : d)),
      }
    case 'removeDevice':
      return {
        ...state,
        devices: state.devices.filter((d) => d.id !== action.id),
        quickActions: state.quickActions.filter((q) => q.deviceId !== action.id),
      }
    case 'addDevice':
      return { ...state, devices: [...state.devices, action.device] }
    case 'addRoom':
      return { ...state, rooms: [...state.rooms, action.room] }
    case 'moveDevice':
      return {
        ...state,
        devices: state.devices.map((d) =>
          d.id === action.deviceId ? { ...d, roomId: action.roomId } : d,
        ),
      }
    case 'toggleFavorite':
      return {
        ...state,
        devices: state.devices.map((d) =>
          d.id === action.id ? { ...d, favorite: !d.favorite } : d,
        ),
      }
    case 'toggleSceneFavorite':
      return {
        ...state,
        scenes: state.scenes.map((s) =>
          s.id === action.id ? { ...s, favorite: !s.favorite } : s,
        ),
      }
    case 'toggleQuickFavorite':
      return {
        ...state,
        quickActions: state.quickActions.map((q) =>
          q.id === action.id ? { ...q, favorite: !q.favorite } : q,
        ),
      }
    case 'addActivity':
      return { ...state, activity: [action.event, ...state.activity] }
    case 'addRequest':
      return { ...state, requests: [action.request, ...state.requests] }
    case 'setExecutingScene':
      return { ...state, executingSceneId: action.id }
    case 'patchSettings':
      return { ...state, settings: { ...state.settings, ...action.patch } }
    case 'setSearch':
      return { ...state, searchQuery: action.query }
    default:
      return state
  }
}

type StoreValue = State & {
  route: Route
  tab: Tab
  push: (route: Route) => void
  back: () => void
  goTab: (tab: Tab) => void
  replace: (route: Route) => void
  roomById: (id: string) => Room | undefined
  deviceById: (id: string) => Device | undefined
  devicesInRoom: (roomId: string) => Device[]
  devicesOfType: (type: DeviceType) => Device[]
  send: (deviceId: string, command: string, payload?: CommandPayload) => Promise<boolean>
  runScene: (sceneId: string) => Promise<void>
  addDevice: (input: {
    name: string
    brand: string
    type: DeviceType
    roomId: string
    connectionType: ConnectionType
    irProfileId?: string
  }) => void
  addRoom: (name: string) => string
  moveDevice: (deviceId: string, roomId: string) => void
  removeDevice: (id: string) => void
  renameDevice: (id: string, name: string) => void
  updateDevice: (id: string, patch: Partial<Device>) => void
  toggleFavorite: (id: string) => void
  toggleSceneFavorite: (id: string) => void
  toggleQuickFavorite: (id: string) => void
  patchSettings: (patch: Partial<Settings>) => void
  setSearch: (query: string) => void
  requestProduct: (input: {
    kind?: FeedbackKind
    productType: string
    brand?: string
    model?: string
    details: string
  }) => void
}

const StoreContext = createContext<StoreValue | null>(null)

function tabFromRoute(route: Route): Tab {
  if (route.name === 'settings' || route.name === 'ask' || route.name === 'scenes') return 'settings'
  if (
    route.name === 'devices' ||
    route.name === 'category' ||
    route.name === 'rooms' ||
    route.name === 'room' ||
    route.name === 'add-device' ||
    route.name === 'remote' ||
    route.name === 'device-settings' ||
    route.name === 'favorites' ||
    route.name === 'search'
  )
    return 'devices'
  return 'home'
}

function requestActivityMessage(request: ProductRequest) {
  const name = request.productType || 'something'
  if (request.kind === 'feature') return `Requested feature “${name}”`
  if (request.kind === 'missing') return `Reported missing “${name}”`
  if (request.kind === 'issue') return `Reported issue: ${name}`
  return `Requested ${name} ASAP`
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial)
  const route = state.stack[state.stack.length - 1] ?? { name: 'home' as const }

  const push = useCallback((next: Route) => dispatch({ type: 'push', route: next }), [])
  const back = useCallback(() => dispatch({ type: 'back' }), [])
  const replace = useCallback((next: Route) => dispatch({ type: 'replace', route: next }), [])
  const goTab = useCallback((tab: Tab) => dispatch({ type: 'tab', tab }), [])

  const roomById = useCallback(
    (id: string) => state.rooms.find((r) => r.id === id),
    [state.rooms],
  )
  const deviceById = useCallback(
    (id: string) => state.devices.find((d) => d.id === id),
    [state.devices],
  )
  const devicesInRoom = useCallback(
    (roomId: string) => state.devices.filter((d) => d.roomId === roomId),
    [state.devices],
  )
  const devicesOfType = useCallback(
    (type: DeviceType) => state.devices.filter((d) => d.type === type),
    [state.devices],
  )

  const send = useCallback(
    async (deviceId: string, command: string, payload?: CommandPayload) => {
      const device = state.devices.find((d) => d.id === deviceId)
      if (!device) return false
      if (state.settings.haptics) haptic('light')
      const next: Device = {
        ...device,
        state: { ...device.state },
        lastUsedAt: Date.now(),
        status: device.status === 'offline' ? 'offline' : 'connecting',
      }
      const pending = dispatchHardware(next, command, payload)
      dispatch({ type: 'setDevice', device: next })
      const result = await pending
      dispatch({
        type: 'setDevice',
        device: { ...next, status: result.ok ? 'connected' : device.status },
      })
      if (result.ok) {
        dispatch({
          type: 'addActivity',
          event: {
            id: crypto.randomUUID(),
            deviceId,
            message: commandLabel(next, command, payload),
            timestamp: Date.now(),
          },
        })
      }
      return result.ok
    },
    [state.devices, state.settings.haptics],
  )

  const runScene = useCallback(
    async (sceneId: string) => {
      const scene = state.scenes.find((s) => s.id === sceneId)
      if (!scene) return
      dispatch({ type: 'setExecutingScene', id: sceneId })
      if (state.settings.haptics) haptic('success')
      for (const action of scene.actions) {
        await send(action.deviceId, action.command, { value: action.value })
      }
      dispatch({
        type: 'addActivity',
        event: {
          id: crypto.randomUUID(),
          sceneId,
          message: `Ran “${scene.name}”`,
          timestamp: Date.now(),
        },
      })
      dispatch({ type: 'setExecutingScene', id: null })
    },
    [send, state.scenes, state.settings.haptics],
  )

  const addDevice = useCallback(
    (input: {
      name: string
      brand: string
      type: DeviceType
      roomId: string
      connectionType: ConnectionType
      irProfileId?: string
    }) => {
      const device: Device = {
        id: crypto.randomUUID(),
        name: input.name,
        brand: input.brand,
        type: input.type,
        roomId: input.roomId,
        connectionType: input.connectionType,
        status: 'connected',
        favorite: false,
        lastUsedAt: Date.now(),
        irProfileId: input.irProfileId,
        state: defaultDeviceState(),
      }
      dispatch({ type: 'addDevice', device })
      dispatch({
        type: 'addActivity',
        event: {
          id: crypto.randomUUID(),
          deviceId: device.id,
          message: `Added ${device.name}`,
          timestamp: Date.now(),
        },
      })
    },
    [],
  )

  const addRoom = useCallback((name: string) => {
    const room = { id: crypto.randomUUID(), name }
    dispatch({ type: 'addRoom', room })
    return room.id
  }, [])

  const moveDevice = useCallback((deviceId: string, roomId: string) => {
    dispatch({ type: 'moveDevice', deviceId, roomId })
  }, [])

  const removeDevice = useCallback((id: string) => {
    dispatch({ type: 'removeDevice', id })
  }, [])

  const renameDevice = useCallback((id: string, name: string) => {
    dispatch({ type: 'patchDevice', id, patch: { name } })
  }, [])

  const updateDevice = useCallback((id: string, patch: Partial<Device>) => {
    dispatch({ type: 'patchDevice', id, patch })
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    dispatch({ type: 'toggleFavorite', id })
  }, [])

  const toggleSceneFavorite = useCallback((id: string) => {
    dispatch({ type: 'toggleSceneFavorite', id })
  }, [])

  const toggleQuickFavorite = useCallback((id: string) => {
    dispatch({ type: 'toggleQuickFavorite', id })
  }, [])

  const patchSettings = useCallback((patch: Partial<Settings>) => {
    dispatch({ type: 'patchSettings', patch })
  }, [])

  const setSearch = useCallback((query: string) => {
    dispatch({ type: 'setSearch', query })
  }, [])

  const requestProduct = useCallback(
    (input: {
      kind?: FeedbackKind
      productType: string
      brand?: string
      model?: string
      details: string
    }) => {
      const kind = input.kind ?? 'product'
      const request: ProductRequest = {
        id: crypto.randomUUID(),
        kind,
        productType: input.productType.trim(),
        brand: (input.brand ?? '').trim(),
        model: (input.model ?? '').trim(),
        details: input.details.trim(),
        asap: true,
        timestamp: Date.now(),
      }
      dispatch({ type: 'addRequest', request })
      dispatch({
        type: 'addActivity',
        event: {
          id: crypto.randomUUID(),
          message: requestActivityMessage(request),
          timestamp: Date.now(),
        },
      })
    },
    [],
  )

  const value = useMemo<StoreValue>(
    () => ({
      ...state,
      route,
      tab: tabFromRoute(route),
      push,
      back,
      goTab,
      replace,
      roomById,
      deviceById,
      devicesInRoom,
      devicesOfType,
      send,
      runScene,
      addDevice,
      addRoom,
      moveDevice,
      removeDevice,
      renameDevice,
      updateDevice,
      toggleFavorite,
      toggleSceneFavorite,
      toggleQuickFavorite,
      patchSettings,
      setSearch,
      requestProduct,
    }),
    [
      state,
      route,
      push,
      back,
      goTab,
      replace,
      roomById,
      deviceById,
      devicesInRoom,
      devicesOfType,
      send,
      runScene,
      addDevice,
      addRoom,
      moveDevice,
      removeDevice,
      renameDevice,
      updateDevice,
      toggleFavorite,
      toggleSceneFavorite,
      toggleQuickFavorite,
      patchSettings,
      setSearch,
      requestProduct,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
