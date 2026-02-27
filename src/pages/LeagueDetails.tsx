import { createResource, Show, For, createSignal } from "solid-js";
import { useParams } from "@solidjs/router";
import pb from "../data/pb";
import {LeagueResponse, VoteSettingsRecord, RoundResponse} from "../models/pocketbase-types";
import {AuthRecord} from "pocketbase";
import { AddRoundForm } from "../components/AddRoundForm";
import { EditRoundForm } from "../components/EditRoundForm";

const fetchLeague = async (id: string) : Promise<LeagueResponse> => {
    return await pb.collection('league').getOne(id, {
        expand: 'owner,vote_settings'
    });
};

const fetchRounds = async (leagueId: string) : Promise<RoundResponse[]> => {
    return await pb.collection('round').getFullList({
        filter: `league = "${leagueId}"`,
        sort: 'order'
    });
    // league.private = 0 || league.members ?= @request.auth.id
};

export const LeagueDetails = () => {
    const params = useParams();
    const [league] = createResource(() => params.id, fetchLeague);
    const [rounds, { refetch }] = createResource(() => params.id, fetchRounds);
    const vote_settings = () => league()?.expand?.vote_settings as VoteSettingsRecord;
    const owner = () => league()?.expand?.owner as AuthRecord;

    const [editingRound, setEditingRound] = createSignal<RoundResponse | null>(null);

    return (
        <div class="max-w-4xl mx-auto p-6 space-y-6">
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

                <div class="card bg-base-200 shadow-xl mt-6">
                    <div class="card-body">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="card-title text-2xl">Rounds</h3>
                            <Show when={league()?.owner === pb.authStore.record?.id}>
                                <button 
                                    class="btn btn-primary btn-sm"
                                    onClick={() => {
                                        const modal = document.getElementById('add_round_modal') as HTMLDialogElement;
                                        modal?.showModal();
                                    }}
                                >
                                    Add Round
                                </button>
                            </Show>
                        </div>
                        <Show when={rounds()?.length} fallback={<div class="p-4 text-center text-base-content/50 italic">No rounds added yet.</div>}>
                            <div class="flex flex-col gap-4">
                                <For each={rounds()}>
                                    {(round) => (
                                        <div class="collapse collapse-arrow bg-base-100">
                                            <input type="checkbox" /> 
                                            <div class="collapse-title flex items-center gap-4">
                                                <div class="badge badge-outline">{round.order}</div>
                                                <span class="font-bold">{round.title}</span>
                                                <div class={`badge ml-auto ${
                                                    round.status === 'complete' ? 'badge-success' : 
                                                    round.status === 'voting' ? 'badge-info' : 
                                                    round.status === 'accepting_submissions' ? 'badge-warning' : 
                                                    'badge-ghost'
                                                }`}>
                                                    {round.status.replace('_', ' ')}
                                                </div>
                                            </div>
                                            <div class="collapse-content">
                                                <p class="py-2 text-base-content/70">{round.description || 'No description provided.'}</p>
                                                <div class="flex justify-end mt-2 gap-2">
                                                    <Show when={round.status === 'not_started' && round.createdBy === pb.authStore.record?.id}>
                                                        <button 
                                                            class="btn btn-sm btn-outline btn-warning"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setEditingRound(round);
                                                                const modal = document.getElementById('edit_round_modal') as HTMLDialogElement;
                                                                modal?.showModal();
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                    </Show>
                                                    <Show when={round.status === 'not_started' && round.createdBy === pb.authStore.record?.id}>
                                                        <button 
                                                            class="btn btn-sm btn-outline btn-error"
                                                            onClick={async (e) => {
                                                                e.stopPropagation();
                                                                if (confirm(`Are you sure you want to delete round "${round.title}"?`)) {
                                                                    try {
                                                                        await pb.collection('round').delete(round.id);
                                                                        refetch();
                                                                    } catch (err: any) {
                                                                        alert(err.message || "Failed to delete round.");
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </Show>
                                                    <button class="btn btn-sm btn-ghost">View Submissions</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </For>
                            </div>
                        </Show>
                    </div>
                </div>
            </Show>
            
            <dialog id="add_round_modal" class="modal">
                <div class="modal-box p-0">
                    <form method="dialog">
                        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10">✕</button>
                    </form>
                    <AddRoundForm 
                        leagueId={params.id!} 
                        onSuccess={() => {
                            const modal = document.getElementById('add_round_modal') as HTMLDialogElement;
                            modal?.close();
                            refetch();
                        }} 
                    />
                </div>
                <form method="dialog" class="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            <dialog id="edit_round_modal" class="modal">
                <div class="modal-box p-0">
                    <form method="dialog">
                        <button 
                            class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10"
                            onClick={() => setEditingRound(null)}
                        >✕</button>
                    </form>
                    <Show when={editingRound()}>
                        {(round) => (
                            <EditRoundForm 
                                round={round()} 
                                onSuccess={() => {
                                    const modal = document.getElementById('edit_round_modal') as HTMLDialogElement;
                                    modal?.close();
                                    setEditingRound(null);
                                    refetch();
                                }}
                                onCancel={() => {
                                    const modal = document.getElementById('edit_round_modal') as HTMLDialogElement;
                                    modal?.close();
                                    setEditingRound(null);
                                }}
                            />
                        )}
                    </Show>
                </div>
                <form method="dialog" class="modal-backdrop">
                    <button onClick={() => setEditingRound(null)}>close</button>
                </form>
            </dialog>
        </div>
    );
};
