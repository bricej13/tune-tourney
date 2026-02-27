import { createResource, For, Show } from "solid-js";
import { A } from "@solidjs/router";
import pb from "../data/pb";
import userStore from "../state/userStore";
import { LeagueResponse } from "../models/pocketbase-types";

const fetchUserLeagues = async (userId: string | undefined) => {
    if (!userId) return [];
    return await pb.collection('league').getFullList({
        filter: `members.id ?= "${userId}"`,
        sort: '-created',
        expand: 'owner',
        requestKey: 'my-leagues'});
};

const fetchPublicLeagues = async () => {
    return await pb.collection('league').getFullList({
        filter: 'private = false',
        sort: '-created',
        expand: 'owner',
        requestKey: 'public-leagues'
    });
};

const LeagueCard = (props: { league: LeagueResponse<any> }) => {
    return (
        <div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
            <Show when={props.league.banner}>
                <figure class="h-32">
                    <img 
                        src={pb.files.getURL(props.league, props.league.banner!)} 
                        alt={props.league.name} 
                        class="w-full h-full object-cover"
                    />
                </figure>
            </Show>
            <div class="card-body p-4">
                <h3 class="card-title text-lg truncate">{props.league.name}</h3>
                <p class="text-xs text-base-content/70 line-clamp-2 min-h-8">
                    {props.league.description || "No description provided."}
                </p>
                <div class="flex justify-between items-center mt-2">
                    <div class="text-xs text-base-content/50">
                        {props.league.members?.length || 0} Members
                    </div>
                    <A href={`/leagues/${props.league.id}`} class="btn btn-primary btn-xs">
                        View
                    </A>
                </div>
            </div>
        </div>
    );
};

export const Leagues = () => {
    const { user } = userStore;
    const [userLeagues] = createResource(() => user()?.id, fetchUserLeagues);
    const [publicLeagues] = createResource(fetchPublicLeagues);

    return (
        <div class="max-w-6xl mx-auto p-6 space-y-12">
            <div class="flex justify-between items-center">
                <h2 class="text-3xl font-bold">Leagues</h2>
                <A href="/leagues/create" class="btn btn-secondary btn-sm">Create New League</A>
            </div>

            {/* My Leagues Section */}
            <Show when={user()}>
                <section>
                    <h3 class="text-2xl font-semibold mb-6 flex items-center gap-2">
                        My Leagues
                        <span class="badge badge-outline">{userLeagues()?.length || 0}</span>
                    </h3>
                    <Show 
                        when={!userLeagues.loading} 
                        fallback={<div class="flex justify-center p-10"><span class="loading loading-spinner loading-lg text-primary"></span></div>}
                    >
                        <Show 
                            when={userLeagues() && userLeagues()!.length > 0}
                            fallback={
                                <div class="bg-base-200 rounded-xl p-8 text-center text-base-content/60 italic">
                                    You haven't joined any leagues yet.
                                </div>
                            }
                        >
                            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                <For each={userLeagues()}>
                                    {(league) => <LeagueCard league={league} />}
                                </For>
                            </div>
                        </Show>
                    </Show>
                </section>
            </Show>

            {/* Public Leagues Section */}
            <section>
                <h3 class="text-2xl font-semibold mb-6 flex items-center gap-2">
                    Public Leagues
                    <span class="badge badge-outline">{publicLeagues()?.length || 0}</span>
                </h3>
                <Show 
                    when={!publicLeagues.loading} 
                    fallback={<div class="flex justify-center p-10"><span class="loading loading-spinner loading-lg text-secondary"></span></div>}
                >
                    <Show 
                        when={publicLeagues() && publicLeagues()!.length > 0}
                        fallback={
                            <div class="bg-base-200 rounded-xl p-8 text-center text-base-content/60 italic">
                                No public leagues found.
                            </div>
                        }
                    >
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            <For each={publicLeagues()}>
                                {(league) => <LeagueCard league={league} />}
                            </For>
                        </div>
                    </Show>
                </Show>
            </section>
        </div>
    );
};
