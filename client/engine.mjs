import * as alt from 'alt'
import * as native from 'natives'

alt.log('Loaded: vehicle-mods->client/engine.mjs')

let timeKeyPressed = 0
let vehicle
let interval

alt.on('keydown', (key) => {
    if (key === 'F'.charCodeAt(0)) {
        if (alt.Player.local.vehicle) { // If the player is in a vehicle
            vehicle = alt.Player.local.vehicle.scriptID // Get the vehicle script ID
            if (native.getIsVehicleEngineRunning(vehicle)) { // If the engine is running
                timeKeyPressed = Date.now() // Get the actual time in milliseconds
            }
        }
    }
})

alt.on('keyup', (key) => {
    if (key == 'F'.charCodeAt(0)) {
        if (timeKeyPressed > 0) { // If we're pressing the button and the player is in a vehicle
            timeKeyPressed = Date.now() - timeKeyPressed // Get the difference between key is pressed and released
            if (timeKeyPressed <= 500) { // If it's pressed for lesser then 500ms
                interval = alt.setInterval(turnEngineOn, 100) // Leave the engine on
                return
            }
            clear() // Clear variables
        }
    }
})

/**
 * Sets the engine back on
 */
function turnEngineOn() {
    if (vehicle && !alt.Player.local.vehicle) { // If there's a vehicle & the player isn't in a vehicle anymore
        native.setVehicleEngineOn(vehicle, true, true, false) // Set the engine on
        clear() // Clear variables
    }
}

/**
 * Clear the interval, vehicle and timeKeyPressed variables
 */
function clear() {
    if (interval)
        alt.clearInterval(interval) // Clear the interval
    
    vehicle = null // Remove the vehicle, because we don't need it anymore
    timeKeyPressed = 0 // Reset the variable
}