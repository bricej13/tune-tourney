import {batch, createSignal, For, Show} from "solid-js";
import userStore from "../state/userStore";
import {TbOutlinePlayerPlay, TbOutlineTrash} from "solid-icons/tb";

export interface SpotifyTrack {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
        name: string;
        images: { url: string }[];
    };
    external_urls: { spotify: string };
}

interface SpotifyTrackSearchProps {
    onSelect: (track: SpotifyTrack | undefined) => void;
    track?: SpotifyTrack;
}

export const SpotifyTrackSearchField = (props: SpotifyTrackSearchProps) => {
    const [query, setQuery] = createSignal("");
    const [results, setResults] = createSignal<SpotifyTrack[]>([]);
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal<string | null>(null);

    const searchTracks = async () => {
        if (!query().trim()) return;

        setLoading(true);
        setError(null);

        try {

            const response = await userStore.getSpotifyToken().then(accessToken =>
                fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query())}&type=track&limit=10`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
            )

            if (!response.ok) {
                if (response.status === 401) {
                    setError("Spotify session expired. Please log in again.");
                } else {
                    const errorData = await response.json();
                    setError(errorData.error?.message || "Failed to search Spotify.");
                }
                return;
            }

            const data = await response.json();
            setResults(data.tracks.items);
        } catch (err: any) {
            setError(err.message || "An error occurred while searching.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    const onSelect = (track: SpotifyTrack | undefined) => {
        props.onSelect(track)
        batch(() => {
            setQuery("")
            setResults([])
        })
    }

    return (
        <Show when={!props.track}
              fallback={
                  <ul class="list">
                      <li class="list-row">
                          <div><img class="size-10 rounded-box"
                                    src={props.track?.album.images[0].url}/></div>
                          <div>
                              <div>{props.track?.name}</div>
                              <div class="text-xs uppercase font-semibold opacity-60">{props.track?.artists.map(a => a.name).join(', ')}</div>
                          </div>
                          <button class="btn btn-square btn-ghost">
                              <TbOutlinePlayerPlay size={20} />
                          </button>
                          <button class="btn btn-square btn-ghost" onClick={() => onSelect(undefined)}>
                              <TbOutlineTrash size={20} />
                          </button>
                      </li>
                  </ul>

              }
        >

            <div class="space-y-4">
                <div class="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search for a track..."
                        class="input input-bordered flex-1"
                        value={query()}
                        onInput={(e) => setQuery(e.currentTarget.value)}
                        onKeyDown={(e) => e.key === "Enter" && searchTracks()}
                    />
                    <button
                        class="btn btn-primary"
                        onClick={searchTracks}
                        disabled={loading() || !query().trim()}
                    >
                        <Show when={loading()} fallback="Search">
                            <span class="loading loading-spinner loading-xs"></span>
                        </Show>
                    </button>
                </div>

                <Show when={error()}>
                    <div class="alert alert-error text-sm py-2">
                        <span>{error()}</span>
                    </div>
                </Show>

                <div class="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                    <For each={results()}>
                        {(track) => (
                            <div
                                class="flex items-center justify-between p-2 bg-base-100 rounded-lg hover:bg-base-300 hover:cursor-pointer transition-colors"
                                onClick={() => onSelect(track)}>
                                <div class="flex items-center gap-3 overflow-hidden">
                                    <Show when={track.album.images.length > 0}>
                                        <img
                                            src={track.album.images[track.album.images.length - 1].url}
                                            alt={track.album.name}
                                            class="w-12 h-12 rounded object-cover flex-shrink-0"
                                        />
                                    </Show>
                                    <div class="truncate">
                                        <div class="font-bold truncate">{track.name}</div>
                                        <div class="text-xs text-base-content/60 truncate">
                                            {track.artists.map(a => a.name).join(", ")} • {track.album.name}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </For>
                    <Show when={results().length === 0 && !loading() && query() && !error()}>
                        <p class="text-center text-base-content/50 italic py-4">No tracks found.</p>
                    </Show>
                </div>
            </div>
        </Show>
    );
};
