#! /usr/bin/python3

from pynput.keyboard import Key,  Controller
from os import path, name
import time

root = path.realpath(path.join(path.dirname(__file__), '..'))

keyboard = Controller()


def new_tab():
    # Windows Terminal
    if name == 'nt':
        with keyboard.pressed(Key.ctrl, Key.shift):
            keyboard.press('1')
        return time.sleep(0.8)

    with keyboard.pressed(Key.cmd):
        keyboard.press('t')
        keyboard.release('t')
    return time.sleep(0.2)


def main():
    new_tab()
    keyboard.type('cd ' + path.join(root, 'packages', 'core') + '\n')
    keyboard.type('yarn start\n')

    new_tab()
    keyboard.type('cd ' + path.join(root, 'packages', 'ui') + '\n')
    keyboard.type('yarn start\n')

    new_tab()
    keyboard.type('cd ' + path.join(root, 'packages', 'inject') + '\n')
    keyboard.type('yarn start\n')

    new_tab()
    keyboard.type('cd ' + path.join(root, 'packages', 'website') + '\n')
    keyboard.type('yarn dev\n')

    new_tab()
    keyboard.type('cd ' + path.join(root, 'packages', 'extension') + '\n')

    keyboard.type('yarn start\n')

    new_tab()
    keyboard.type('cd ' + path.join(root, 'packages', 'extension') + '\n')
    keyboard.type('yarn start:worker\n')


main()
