import { createSignal, Show } from "solid-js";
import pb from "../data/pb";
import { RoundResponse } from "../models/pocketbase-types";

interface EditRoundFormProps {
    round: RoundResponse;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const EditRoundForm = (props: EditRoundFormProps) => {
    const [title, setTitle] = createSignal(props.round.title);
    const [description, setDescription] = createSignal(props.round.description || "");
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal<string | null>(null);

    const onSubmit = async (e: Event) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await pb.collection('round').update(props.round.id, {
                title: title(),
                description: description(),
            });

            if (props.onSuccess) {
                props.onSuccess();
            }
        } catch (err: any) {
            setError(err.message || "Failed to update round.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div class="card bg-base-100 shadow-md">
            <div class="card-body">
                <h3 class="card-title text-xl mb-2">Edit Round</h3>
                <form onSubmit={onSubmit} class="space-y-4">
                    <div class="form-control w-full">
                        <label class="label"><span class="label-text font-semibold">Title</span></label>
                        <input
                            type="text"
                            placeholder="Round Title"
                            class="input input-bordered w-full"
                            value={title()}
                            onInput={(e) => setTitle(e.currentTarget.value)}
                            required
                        />
                    </div>

                    <div class="form-control w-full">
                        <label class="label"><span class="label-text font-semibold">Description (optional)</span></label>
                        <textarea
                            class="textarea textarea-bordered h-20"
                            placeholder="What's this round about?"
                            value={description()}
                            onInput={(e) => setDescription(e.currentTarget.value)}
                        ></textarea>
                    </div>

                    <Show when={error()}>
                        <div class="alert alert-error text-sm py-2">
                            <span>{error()}</span>
                        </div>
                    </Show>

                    <div class="card-actions justify-end mt-2 gap-2">
                        <button 
                            type="button" 
                            class="btn btn-ghost btn-sm" 
                            onClick={() => props.onCancel?.()}
                            disabled={loading()}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            class="btn btn-primary btn-sm" 
                            disabled={loading()}
                        >
                            <Show when={loading()} fallback={"Save Changes"}>
                                <span class="loading loading-spinner loading-xs"></span> Saving...
                            </Show>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
