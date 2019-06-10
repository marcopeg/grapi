import { runQuery } from '@forrestjs/feature-network/client'
import { setList, setItem } from './gigsguide.reducer'

export const loadEvents = () => async (dispatch) => {
    const query = await dispatch(runQuery(`
        query q {
            GigsGuide {
                events (
                    city:"malmo"
                    startDate:"2019-07-01"
                    endDate:"2019-07-14"
                ) {
                    _id
                    title
                }
            }
        }
    `))

    dispatch(setList(query.data.GigsGuide.events))
}

export const loadEvent = (eventId) => async (dispatch) => {
    const query = await dispatch(runQuery(`
        query q {
            GigsGuide {
                event (eventId: "${eventId}") {
                    _id
                    title
                }
            }
        }
    `))

    dispatch(setItem(query.data.GigsGuide.event))
}
