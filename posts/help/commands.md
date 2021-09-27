---
title: Commands
---

# Commands

## Economy

### stats

`/waifu stats [member]`

Return global stats of the game for the guild or for the specified user.

### coins

`/waifu coins [member]`

Return your amount of coins or the specified user one.

### donate

`/waifu coins <amount> <member>`

Give `<amount>` coins of yours to `<member>`.

## Search

### search

`/waifu search <name>`

Lookup a character on AniList and its associated data in the game (owners, trackers, etc.).

### birthday

`/waifu birthday`

Check characters born on this day.

## Waifu economy

### roll

`/waifu roll`

Exchange coins for characters.

### reroll

`/waifu reroll`

Exchange characters for other characters.

- 1 character: 1/3 chance of success
- 2 characters: 2/3 chance of success
- 3 characters: 1 character guaranteed
- 4 characters: 1 character guaranteed + 1/3 chance of success for a second
- ...

Obtained characters have a rank equal or max 2 times higher (3 times for E) than the least ranked character you offered.

Rerolled characters are stored for 15 days at Nana-chan, they can be revived with blood. Then, they are blooded by Nana-chan.

### trade

`/waifu trade <member>`

Trade your characters with `<member>`.

### random

`/waifu random <number>`

Try your luck on a dry roll of `<number>` or 1 character.

### daily

`/waifu daily`

Show stats of the daily tag roll.

## Blood

### blood

`/waifu blood`

Exchange characters for blood. Blooded characters can't be revived.

### offering

`/waifu offering <id>`

`id` is the AniList ID of a character (can be found at the bottom of embeds).

Revive a previously rerolled character (stored at Nana-chan) in exchange of blood. Revived characters get a 🌈 badge.

Revived characters are blooded after rerolls.

## Waifu management

### list

`/waifu list <filter> [member]`

List your/`user`'s owned characters, filtering by `filter`.

### lock

`/waifu lock`

Lock characters you own so they can't be traded or blooded.

### unlock

`/waifu unlock`

Unlock previously locked characters.

### ascend

`/waifu ascend`

Ascend characters you own 4 times so they appear 4 times bigger on the collage and obtain the 🌟 badge.

### customize

`/waifu customize`

Change an ascended character name and image.

### reorder

`/waifu reorder`

Change the position of an ascended character on your collage.

## Collage & Album

### collage

`/waifu collage <filter> [member]`

Same as `list` but visually on a image.

### collage-custom add

`/waifu collage-custom add`

Add characters to the `filter:custom` collage.

### collage-custom remove

`/waifu collage-custom remove`

Remove characters from the `filter:custom` collage.

### album

`/waifu collage <type> <search> [member] [owned_only=False]`

Visualize your owned characters and missing ones on a particular series or collection.

## Tracking

### track list

`/waifu track list [member]`

List your tracked series and collections.

### track add

`/waifu track add <id>`

`id` is the AniList ID of a media (can be found at the bottom of embeds).

Add a series to your tracking list.

### track remove

`/waifu track add <id>`

`id` is the AniList ID of a media (can be found at the bottom of embeds).

Remove a series from your tracking list.

### track-collection new

`/waifu track-collection new <name>`

Create a new tracking collection called `name`.

### track-collection add

`/waifu track-collection add <colle_id> <media_id>`

`colle_id` is the ID of the collection (can be found on `/waifu track list`)

`media_id` is the AniList ID of a media (can be found at the bottom of embeds).

Add a media to a collection you own.

### track-collection delete

`/waifu track-collection delete <id>`

`id` is the ID of the collection (can be found on `/waifu track list`)

Delete a collection you own.

## Say

### say

`/waifu say <id> <content>`

`id` is the AniList ID of a character (can be found at the bottom of embeds).

Make an ascended waifu you own say something for you.

### autosay

`/waifu autosay [id]`

`id` is the AniList ID of a character (can be found at the bottom of embeds).

Make an ascended waifu you own say everything for you. Disable it by passing no `id` to the command.

## Utilitary

### utils link

`/waifu utils link`

Update (this) website data.

### utils export

`/waifu utils export`

Get a copy of the game data.

### utils charadf

`/waifu utils charadf [member]`

Lookup the character pool of a player.

### utils prune

`/waifu utils prune`

Remove deleted characters on AniList from the database.
