player enters
- find user record by name
- auth with pw
- call logOn
- create, save and send jwt
- client stores in localstorage

player moves
- accept and parse command
- find and test move target with position canEnter
- if can, then update player x,y in db
- fetch and hydrate position items
- return next position data (name, desc, visible items)

player takes item
- fetch and hydrate items in pos
- if target is there call item.onPickUp with user
- updates player and item

player drops item
- fetch and hydrate items in inventory
- if target is there call item.onDrop with user
- updates player and item

player uses item
- fetch and hydrate items in inventory
- if target item is there call item.use with user and target user if given
- item effects are applied
- updates player and item

player leaves
- fetch and hydrate user, call logOff