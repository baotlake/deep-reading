#! /usr/bin/python3

from pynput.keyboard import Key,  Controller

keyboard = Controller()

def new_tab():
    with keyboard.pressed(Key.cmd):
        keyboard.press('t')
        keyboard.release('t')

new_tab()
keyboard.type('cd ~/Project/deep-reading/packages/core\n')
keyboard.type('yarn start\n')

new_tab()
keyboard.type('cd ~/Project/deep-reading/packages/ui\n')
keyboard.type('yarn start\n')

new_tab()
keyboard.type('cd ~/Project/deep-reading/packages/inject\n')
keyboard.type('yarn start\n')

new_tab()
keyboard.type('cd ~/Project/deep-reading/packages/website\n')
keyboard.type('yarn dev\n')

new_tab()
keyboard.type('cd ~/Project/deep-reading/packages/extension\n')
keyboard.type('yarn start\n')

new_tab()
keyboard.type('cd ~/Project/deep-reading/packages/extension\n')
keyboard.type('yarn start:worker\n')


