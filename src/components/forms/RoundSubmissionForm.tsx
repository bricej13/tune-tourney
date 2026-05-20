import {SpotifyTrack, SpotifyTrackSearch} from "../SpotifyTrackSearch";
import {createForm, reset, setValues} from "@modular-forms/solid";
import {For} from "solid-js";
import {SpotifyTrackSearchField} from "../SpotifyTrackSearchField";

interface RoundSubmissionFormProps {
    leagueId: string;
    roundId: string;
    onSuccess?: () => void;
}


type RoundSubmissionFormType = {
    round: string;
    tracks: {
        id?: string
        name: string
        artist: string
        album: string
        album_art: string
        spotify_id: string
        spotify_payload: SpotifyTrack
    }[]
}

export const RoundSubmissionForm = ({roundId}: RoundSubmissionFormProps) => {
    const [form, {Form, Field, FieldArray}] = createForm<RoundSubmissionFormType>(
        {
            revalidateOn: 'input', validateOn: 'input',
            initialValues: {
                round: roundId,
                tracks: [{}, {}]
            },
            validate: (values) => {
                console.log('validate', values)
                return Promise.resolve([])
            }
        }
    );


    const onSubmit = async (e: Event) => {
    };


    return (
        <div class="card bg-base-100 shadow-md">
            <div class="card-body">
                <h3 class="card-title text-xl mb-2">Submit tracks</h3>
                <Form>
                    <Field name="round">
                        {(field, props) => <input {...props} class="input" type="hidden" disabled value={field.value}/>}
                    </Field>
                    <FieldArray name="tracks">
                        {(fieldArray) => (
                            <For each={fieldArray.items}>
                                {(_, index) => (
                                    <div>
                                        <Field name={`tracks.${index()}.spotify_id`}>
                                            {(field, props) => <input {...props} class="input" type="hidden"/>}
                                        </Field>
                                        <Field name={`tracks.${index()}.name`}>
                                            {(field, props) => <input {...props} class="input" type="hidden"/>}
                                        </Field>
                                        <Field name={`tracks.${index()}.spotify_payload`}>
                                            {(field, props) => <SpotifyTrackSearchField
                                                track={field.value as SpotifyTrack | undefined} onSelect={(track) => {
                                                if (track) {
                                                    setValues(form, {
                                                        [`tracks.${index()}.spotify_id`]: track.id,
                                                        [`tracks.${index()}.name`]: track.name,
                                                        [`tracks.${index()}.artist`]: track.artists[0].name,
                                                        [`tracks.${index()}.album`]: track.album.name,
                                                        [`tracks.${index()}.album_art`]: track.album.images[0],
                                                        [`tracks.${index()}.spotify_payload`]: track
                                                    });
                                                } else {
                                                    reset(form, [`tracks.${index()}.spotify_id`,
                                                            `tracks.${index()}.name`,
                                                            `tracks.${index()}.artist`,
                                                            `tracks.${index()}.album`,
                                                            `tracks.${index()}.album_art`,
                                                            `tracks.${index()}.spotify_payload`])
                                                }
                                            }}/>
                                            }
                                        </Field>
                                    </div>
                                )}
                            </For>
                        )}
                    </FieldArray>
                </Form>
            </div>
        </div>
    );
};
