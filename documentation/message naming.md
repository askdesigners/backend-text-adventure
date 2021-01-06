## Inbound

All inbound messages must have a jwt

```
command

{
  command: <command text>
}
```

```
profile

{
  payload: <profile update data>
}
```

## Outbound

```
players/nearby
{
  players: [
    {
      _id: <user id>
      name: <user name>
      description: <user desc>
      x: <user x>
      y: <user y>
    }
  ]
} 
```

```
player/leave
{
  _id: <user id>
  name: <user name>
  description: <user desc>
  x: <user x>
  y: <user y>
}
```