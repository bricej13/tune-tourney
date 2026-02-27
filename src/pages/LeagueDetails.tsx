import { createResource, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import pb from "../data/pb";
import {LeagueResponse, VoteSettingsRecord} from "../models/pocketbase-types";
import {AuthRecord} from "pocketbase";

const fetchLeague = async (id: string) : Promise<LeagueResponse> => {
    return await pb.collection('league').getOne(id, {
        expand: 'owner,vote_settings'
    });
};

export const LeagueDetails = () => {
    const params = useParams();
    const [league] = createResource(() => params.id, fetchLeague);
    const vote_settings = () => league()?.expand?.vote_settings as VoteSettingsRecord;
    const owner = () => league()?.expand?.owner as AuthRecord;

    return (
        <div class="max-w-4xl mx-auto p-6">
            <Show when={league()} fallback={<div class="flex justify-center p-10"><span class="loading loading-spinner loading-lg"></span></div>}>
                <div class="card bg-base-200 shadow-xl">
                    <Show when={league()?.banner}>
                        <figure>
                            <img src={pb.files.getURL(league()!, league()!.banner!)} alt="League Banner" />
                        </figure>
                    </Show>
                    <div class="card-body">
                        <div class="flex justify-between items-start">
                            <div>
                                <h2 class="card-title text-3xl">{league()?.name}</h2>
                                <p class="text-base-content/70 mt-2">{league()?.description}</p>
                            </div>
                            <div class="badge badge-primary">{league()?.private ? 'Private' : 'Public'}</div>
                        </div>

                        <div class="divider">Details</div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="stat bg-base-100 rounded-box">
                                <div class="stat-title">Owner</div>
                                <div class="stat-value text-lg">{owner()?.name || owner()?.email || 'Unknown'}</div>
                            </div>
                            <div class="stat bg-base-100 rounded-box">
                                <div class="stat-title">Members</div>
                                <div class="stat-value text-lg">{league()?.members?.length || 0}</div>
                            </div>
                        </div>

                        <Show when={vote_settings()}>
                            <div class="divider">Vote Settings</div>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div class="stat bg-base-100 rounded-box p-2">
                                    <div class="stat-title text-xs">Max Submissions</div>
                                    <div class="stat-value text-sm">{vote_settings().maxSongSubmissions}</div>
                                </div>
                                <div class="stat bg-base-100 rounded-box p-2">
                                    <div class="stat-title text-xs">Max Upvotes</div>
                                    <div class="stat-value text-sm">{vote_settings().maxUpvotes}</div>
                                </div>
                                <div class="stat bg-base-100 rounded-box p-2">
                                    <div class="stat-title text-xs">Max Downvotes</div>
                                    <div class="stat-value text-sm">{vote_settings().maxDownvotes}</div>
                                </div>
                            </div>
                        </Show>
                    </div>
                </div>
            </Show>
        </div>
    );
};
