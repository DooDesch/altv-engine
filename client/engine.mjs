import * as alt from 'alt'
import * as native from 'natives'

alt.log('Loaded: vehicle-mods->client/engine.mjs')

let timeKeyPressed = 0
let vehicle
let engineIsRunning = false

alt.on('keydown', (key) => {
    if (key === 'F'.charCodeAt(0)) {
        if (alt.Player.local.vehicle) { // If the player is in a vehicle
            timeKeyPressed = Date.now() // Get the actual time in milliseconds
            vehicle = alt.Player.local.vehicle.scriptID // Get the vehicle script ID
            engineIsRunning = native.getIsVehicleEngineRunning(vehicle) // If the engine is running
        }
    }
})

alt.on('keyup', (key) => {
    if (key == 'F'.charCodeAt(0)) {
        if (timeKeyPressed > 0) { // If we're pressing the button and the player is in a vehicle
            timeKeyPressed = Date.now() - timeKeyPressed // Get the difference between key is pressed and released
            if (timeKeyPressed > 500) { // If it's pressed for longer then 500ms
                vehicle = null // Set vehicle to null, because we don't need it any longer
                return
            }
        }
    }
})

alt.setInterval(leaveVehicleEngineRunningOnExit, 200)

function leaveVehicleEngineRunningOnExit() {
    if (vehicle && timeKeyPressed <= 500 && !alt.Player.local.vehicle) { // If there's a vehicle & the key is pressed lesser than 500ms & the player isn't in a vehicle anymore
        if (engineIsRunning) { // If the engine is running
            native.setVehicleEngineOn(vehicle, true, true, false) // Set the engine on
        }
        vehicle = null // Remove the vehicle, because we don't need it anymore
    }
}