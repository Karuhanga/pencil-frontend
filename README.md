# Pencil: Frontend

A single page note taking tool... because all your thoughts are connected.

## Live app
[Here.](https://lk-pencil-frontend.firebaseapp.com/)

## Known issues
Because of an issue with change handlers on extensions receiving events, we have a few known issues. Specifically, the extensions' `init`s are called, but mot the `changeState`s. More digging is required to figure out why. 
- Cursor jump on latex interpretation
- Inefficient latex replacement for large docs
- Firefox- Deleting latex needs a select over the latex range
