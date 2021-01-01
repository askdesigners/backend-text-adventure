seed entities into DB
- items

when player joins:
- load inventory items
- load position and return description to client

when player moves:
- search DB for items in that square
- pull and wrap into class instances

when app starts:
- load and wrap map data