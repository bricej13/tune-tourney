## Setup

- Download & unzip the [pocketbase](https://pocketbase.io/docs/) executable in the /pocketbase directory
- Install JS dependencies with `bun install`

## Development

- Run `./pocketbase/pocketbase serve`
- Run `bun dev`
- To update types after making changes to the PB model, run `bun typegen`

## Production

- Run `bun run build`
- Output should be the `pocketbase/pb_public` directory
- Run `./pocketbase/pocketbase serve`


## Architecture
### Pages
- [x] Home - List private and public leagues. Create league button
  - [ ] League Page - Summary at top. List of rounds, current and previous on one tab, future on another.
    - [ ] Round Page (voting summary)
      - [ ] Upcoming - Dates
      - [ ] Submitting Tracks - Show selected track(s) or form to submit track(s)
      - [ ] Accepting Votes - Link to spotify playlist. List of submitted tracks with voting and comments
      - [ ] Past - Show voting and comments