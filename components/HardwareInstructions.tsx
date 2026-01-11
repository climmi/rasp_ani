
import React from 'react';

export const HardwareInstructions: React.FC = () => {
  return (
    <div className="mt-12 text-left bg-slate-800/50 rounded-xl p-6 border border-slate-700 max-w-xl mx-auto backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Hardware Setup: Raspberry Pi 4B
      </h3>
      
      <div className="space-y-4 text-sm text-slate-300">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-900/80 p-3 rounded border border-slate-700">
            <span className="block text-xs text-slate-500 uppercase font-bold">Gewählter Pin</span>
            <span className="text-orange-400 font-mono">GPIO 16</span> (Physical Pin 36)
          </div>
          <div className="bg-slate-900/80 p-3 rounded border border-slate-700">
            <span className="block text-xs text-slate-500 uppercase font-bold">Masse (GND)</span>
            <span className="text-blue-400 font-mono">GND</span> (Physical Pin 34)
          </div>
        </div>

        <p className="text-slate-400 italic text-xs">
          Verbinde den Knopf zwischen Pin 36 (GPIO 16) und Pin 34 (GND). Das Skript nutzt den internen Pull-Up-Widerstand.
        </p>
        
        <div className="bg-slate-950 p-3 rounded font-mono text-xs text-emerald-400 overflow-x-auto border border-emerald-900/30 shadow-inner">
          <pre>{`# 1. Installation: pip install RPi.GPIO pynput
import RPi.GPIO as GPIO
from pynput.keyboard import Key, Controller
import time

kb = Controller()
PIN = 16 # GPIO 16 (Physical Pin 36)

GPIO.setmode(GPIO.BCM)
GPIO.setup(PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)

print("Warte auf Knopfdrück an GPIO 16...")

while True:
    if GPIO.input(PIN) == GPIO.LOW: # Knopf wurde gegen GND gedrückt
        kb.press(Key.space)
        kb.release(Key.space)
        print("Knopf erkannt -> Animation getriggert")
        time.sleep(5.5) # Sperre während der 5s Animation
    time.sleep(0.05)`}</pre>
        </div>
      </div>
    </div>
  );
};
