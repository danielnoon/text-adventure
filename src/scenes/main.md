---
name: main
state:
  before:
    - set var/count 3
options:
  - label: New Game
    action: lds newGame
  - label: Load File
    action: lds loadFile
---

Hello, {{ get var/name }}!
