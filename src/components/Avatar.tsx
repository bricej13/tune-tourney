import {UsersResponse} from "../models/pocketbase-types";
import pb from "../data/pb";
import {RecordModel} from "pocketbase";

interface AvatarProps {
    user: RecordModel | UsersResponse;
}

export const Avatar = ({user}: AvatarProps) => {
    const avatar = pb.files.getURL(user, user.avatar)
    return <div class="mask mask-squircle w-10"><img
        title={user.name}
        alt={user.name}
        src={avatar}/>
    </div>
}