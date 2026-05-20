import { createResource, Show } from "solid-js";
import { useParams, A } from "@solidjs/router";
import pb from "../data/pb";
import {RoundResponse, LeagueResponse, UsersResponse} from "../models/pocketbase-types";
import { SpotifyTrackSearch } from "../components/SpotifyTrackSearch";
import {RoundHeader} from "../components/RoundHeader";
import {Avatar} from "../components/Avatar";
import {RoundSubmissionForm} from "../components/forms/RoundSubmissionForm";

const fetchRound = async (id: string) => {
    return await pb.collection('round').getOne(id, {
        expand: 'league,league.members,createdBy'
    });
};

export const RoundDetails = () => {
    const params = useParams();
    const [round] = createResource(() => params.roundId, fetchRound);

    const league = () => round.latest?.expand?.league as LeagueResponse;
    const creator = () => round.latest?.expand?.createdBy as UsersResponse;
    const members = () => round.latest?.expand?.league.expand.members as UsersResponse[];

    return (
        <div class="max-w-4xl mx-auto p-6 space-y-6">
            <Show when={round()} fallback={<div class="flex justify-center p-10"><span class="loading loading-spinner loading-lg"></span></div>}>
                <div class="text-sm breadcrumbs">
                    <ul>
                        <li><A href="/">Leagues</A></li>
                        <li><A href={`/leagues/${round()?.league}`}>{league()?.name || 'League'}</A></li>
                        <li>Round {round()?.order}: {round()?.title}</li>
                    </ul>
                </div>

                <Show when={round.state === 'ready' && creator}>
                    <RoundHeader round={round.latest!} creator={creator()} />
                    <div class="avatar-group -space-x-2">
                        {members().map(m => <Avatar user={m} />)}
                    </div>
                </Show>

                {/* Submissions/Voting section will go here in future issues */}
                <div class="card bg-base-200 shadow-xl">
                    <div class="card-body">
                        <h3 class="card-title mb-4">Search Tracks</h3>
                        <RoundSubmissionForm roundId={round()!.id} leagueId={league().id} />
                    </div>
                </div>
            </Show>
        </div>
    );
};
