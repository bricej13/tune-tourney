import {RoundResponse, UsersResponse} from "../models/pocketbase-types";

interface RoundHeaderProps {
    round: RoundResponse;
    creator: UsersResponse;
}

export const RoundHeader = ({round, creator}: RoundHeaderProps) => {


    return <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
            <div class="flex justify-between items-start">
                <div>
                    <h2 class="card-title text-3xl">Round {round.order}: {round.title}</h2>
                    <p class="text-base-content/70 mt-2">{round.description || 'No description provided.'}</p>
                </div>
                <div class={`badge ${
                    round.status === 'complete' ? 'badge-success' :
                        round.status === 'voting' ? 'badge-info' :
                            round.status === 'accepting_submissions' ? 'badge-warning' :
                                'badge-ghost'
                }`}>
                    {round.status.replace('_', ' ')}
                </div>
            </div>

            <div class="divider">Details</div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="stat bg-base-100 rounded-box">
                    <div class="stat-title">Created By</div>
                    <div class="stat-value text-lg">{creator.name || creator.email || 'Unknown'}</div>
                </div>
                <div class="stat bg-base-100 rounded-box">
                    <div class="stat-title">Created</div>
                    <div class="stat-value text-lg">{new Date(round.created).toLocaleDateString()}</div>
                </div>
            </div>
        </div>
    </div>


}