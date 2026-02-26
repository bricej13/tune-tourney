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
