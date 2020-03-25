import React ,{Component} from 'react'

export default function DetailTest({history,location,match}) {
    return (
        <div>
            id为：{match.params.id}
        </div>
    )
}
