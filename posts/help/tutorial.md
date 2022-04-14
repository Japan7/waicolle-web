---
title: Tutorial
---

# Tutorial

*Many of the commands presented below can be executed in Nana-chan's DM to avoid #bot-room flood.*

## Goal

In WaiColle you collect characters from your personal anime/manga list if you register yours, else from the server pool of characters.

## Register

Send `/register` in #bot-room to enter the register menu.

Select 📺 first to register your AniList or MyAnimeList if you have one, then re-enter the menu and select 👰‍♀️ to register you into WaiColle.

Then you have to choose your game mode:

* 👰‍♀️ WAIFU: filters Female and Non-binary characters.
* 👰‍♂️ HUSBANDO: filters Male and Non-binary characters.
* 👰 ALL: well, filters nothing.

You can change game mode at any moment via `/register`.

**Be aware that many characters are not tagged with their genre hence do not appear in WAIFU or HUSBANDO mode.**

After your choice you are welcomed with a 10-drop to start your journey!

## Obtain characters

There are serval ways to complete your perfect collection in this game:

### Random drops

Every `random.randint(0, DROP_RATE)` messages on the server, a 👰‍♀️ will appear in reaction of the last message. You have 30 seconds to react on this emote too and obtain a 1-drop in #bot-room. 

### Event drops

By participating in club activities you will be rewarded each time with a `random.randint(1, 3)`-drop. Simple.

### Paid rolls

When registered to WaiColle, you earn 1 moecoin on each message sent on Discord, and **2 on weekends**, starting Friday 6pm.

You can spend this money on rolls via `/waifu roll` and check how many moecoins you have with `/waifu coins`.

In addition, there is a Daily roll on a random tag that costs 75 moecoins the first time of the day.

### Rerolls and trades

If you possess one or more characters you don't like, you can reroll them with `/waifu reroll`.

* 1 character: 1/3 chance of success
* 2 characters: 2/3 chance of success
* 3 characters: 1 character guaranteed
* 4 characters: 1 character guaranteed + 1/3 chance of success for a second
* ...

Obtained characters have a rank equal or higher than the least ranked character you offered.

You can also trade with other players with `/waifu trade <other player>`.

### Blood

Rerolled characters go to Nana-chan. Players can obtain charachters from her list in exchange of blood.

Exchange owned characters for blood with `/waifu blood`.

Obtain characters from Nana-chan in exchange of blood with `/waifu offering <ID>` where ID is the AniList ID of the character you want (present at the footer of any character embed).

## Collection management

*Characters of your collection can be listed with `/waifu list [filter]`. Filters are detailed on the [commands](/help/commands) page.*

### Locks

To prevent accidental rerolls of you favorites characters, feel free to lock them with `/waifu lock`.

They will no longer appear in selection menus and obtain a 🔒 badge.

You can unlock characters at any time with `/waifu unlock`.

### Ascends

If you have 4 copies of the same character you can exchange them for an ascended version of this character with `/waifu ascend`.

Ascended characters are 4 times bigger in Discord collages and obtain the ⭐ badge.

### Collages and albums

Collages and albums are visual ways to check your collection and others ones.

An interactive online collage is available [here](/collage).

*Check the [commands](/help/commands) page for Discord collages and albums.*

### Track lists

Track lists are a great way to track your progress in the game and alert other players that you might be interested in characters they might not before a possible reroll.

*Check the [commands](/help/commands) page to learn how to use them.*

## I have questions

Check the [Q&A](/help/q-and-a) or feel free to ask the devs and other players on #waicolle!
