import userStore from "../state/userStore";
import {createSignal, Show} from "solid-js";
import pb from "../data/pb";
import {LeagueRecord, VoteSettingsRecord} from "../models/pocketbase-types";
import { useNavigate } from "@solidjs/router";

const createVoteSettings = async (data: Omit<VoteSettingsRecord, 'created' | 'id' | 'updated'>) => 
    pb.collection('vote_settings').create(data);

const createLeague = async (data: Omit<LeagueRecord, 'created' | 'id' | 'updated'>) => 
    pb.collection('league').create(data);

export const CreateLeagueForm = () => {
    const {user} = userStore;
    const navigate = useNavigate();
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal<string | null>(null);
    const [success, setSuccess] = createSignal(false);

    // Form state
    const [name, setName] = createSignal("");
    const [description, setDescription] = createSignal("");
    const [isPrivate, setIsPrivate] = createSignal(true);
    
    // Vote settings state
    const [maxSongSubmissions, setMaxSongSubmissions] = createSignal(1);
    const [maxUpvotes, setMaxUpvotes] = createSignal(5);
    const [maxDownvotes, setMaxDownvotes] = createSignal(0);
    const [nonVoterPenalty, setNonVoterPenalty] = createSignal(1);
    const [perSongUpvoteLimit, setPerSongUpvoteLimit] = createSignal(3);
    const [perSongDownvoteLimit, setPerSongDownvoteLimit] = createSignal(3);

    const onSubmit = async (e: Event) => {
        e.preventDefault();
        const currentUser = user();
        if (!currentUser) {
            setError("You must be logged in to create a league.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // 1. Create vote settings
            const voteSettings = await createVoteSettings({
                maxSongSubmissions: maxSongSubmissions(),
                maxUpvotes: maxUpvotes(),
                maxDownvotes: maxDownvotes(),
                nonVoterPenalty: nonVoterPenalty(),
                perSongUpvoteLimit: perSongUpvoteLimit(),
                perSongDownvoteLimit: perSongDownvoteLimit(),
            });

            // 2. Create league
            const league = await createLeague({
                name: name(),
                description: description(),
                private: isPrivate(),
                owner: currentUser.id,
                members: [currentUser.id],
                vote_settings: voteSettings.id,
            });

            setSuccess(true);
            
            // Redirect to the new league page after a short delay to show success
            setTimeout(() => {
                navigate(`/leagues/${league.id}`);
            }, 1000);
        } catch (err: any) {
            setError(err.message || "Failed to create league.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div class="max-w-md mx-auto p-6 bg-base-200 rounded-lg shadow-xl mt-10">
            <h2 class="text-2xl font-bold mb-6">Create New League</h2>
            
            <form onSubmit={onSubmit} class="space-y-4">
                <div class="form-control w-full">
                    <label class="label"><span class="label-text">League Name</span></label>
                    <input 
                        type="text" 
                        placeholder="My Awesome League" 
                        class="input input-bordered w-full" 
                        value={name()} 
                        onInput={(e) => setName(e.currentTarget.value)} 
                        required 
                    />
                </div>

                <div class="form-control w-full">
                    <label class="label"><span class="label-text">Description</span></label>
                    <textarea 
                        class="textarea textarea-bordered h-24" 
                        placeholder="What's this league about?"
                        value={description()}
                        onInput={(e) => setDescription(e.currentTarget.value)}
                    ></textarea>
                </div>

                <div class="form-control">
                    <label class="label cursor-pointer justify-start gap-4">
                        <input 
                            type="checkbox" 
                            class="checkbox checkbox-primary" 
                            checked={isPrivate()} 
                            onChange={(e) => setIsPrivate(e.currentTarget.checked)} 
                        />
                        <span class="label-text">Private League</span>
                    </label>
                </div>

                <div class="divider">Vote Settings</div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="form-control w-full">
                        <label class="label"><span class="label-text">Max Submissions</span></label>
                        <input 
                            type="number" 
                            class="input input-bordered w-full" 
                            value={maxSongSubmissions()} 
                            onInput={(e) => setMaxSongSubmissions(parseInt(e.currentTarget.value))} 
                        />
                    </div>
                    <div class="form-control w-full">
                        <label class="label"><span class="label-text">Max Upvotes</span></label>
                        <input 
                            type="number" 
                            class="input input-bordered w-full" 
                            value={maxUpvotes()} 
                            onInput={(e) => setMaxUpvotes(parseInt(e.currentTarget.value))} 
                        />
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="form-control w-full">
                        <label class="label"><span class="label-text">Max Downvotes</span></label>
                        <input 
                            type="number" 
                            class="input input-bordered w-full" 
                            value={maxDownvotes()} 
                            onInput={(e) => setMaxDownvotes(parseInt(e.currentTarget.value))} 
                        />
                    </div>
                    <div class="form-control w-full">
                        <label class="label"><span class="label-text">Non-voter Penalty</span></label>
                        <input 
                            type="number" 
                            class="input input-bordered w-full" 
                            value={nonVoterPenalty()} 
                            onInput={(e) => setNonVoterPenalty(parseInt(e.currentTarget.value))} 
                        />
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="form-control w-full">
                        <label class="label"><span class="label-text">Upvote Limit/Song</span></label>
                        <input 
                            type="number" 
                            class="input input-bordered w-full" 
                            value={perSongUpvoteLimit()} 
                            onInput={(e) => setPerSongUpvoteLimit(parseInt(e.currentTarget.value))} 
                        />
                    </div>
                    <div class="form-control w-full">
                        <label class="label"><span class="label-text">Downvote Limit/Song</span></label>
                        <input 
                            type="number" 
                            class="input input-bordered w-full" 
                            value={perSongDownvoteLimit()} 
                            onInput={(e) => setPerSongDownvoteLimit(parseInt(e.currentTarget.value))} 
                        />
                    </div>
                </div>

                <Show when={error()}>
                    <div class="alert alert-error shadow-lg">
                        <div>
                            <span>{error()}</span>
                        </div>
                    </div>
                </Show>

                <Show when={success()}>
                    <div class="alert alert-success shadow-lg">
                        <div>
                            <span>League created successfully!</span>
                        </div>
                    </div>
                </Show>

                <button 
                    type="submit" 
                    class="btn btn-primary w-full mt-6" 
                    disabled={loading()}
                >
                    {loading() ? <span class="loading loading-spinner"></span> : "Create League"}
                </button>
            </form>
        </div>
    );
};