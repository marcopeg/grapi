import { runQuery } from '@forrestjs/feature-network'

const fetchQuery = `
    query getJournalEntry {
        session {
            auth {
                journalEntry {
                    createdAt
                    updatedAt
                    day
                    content { id text createdAt updatedAt }
                }
            }
        }
    }`

const saveQuery = `
    mutation setJournalEntry (
        $day: YearMonthDay,
        $content: [JournalEntryContentInput]!
    ) {
        session {
            auth {
                journalEntry (
                    day: $day,
                    content: $content
                ) { updatedAt }
            }
        }
    }`

const formatDate = date => [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, 0),
].join('-')

export const fetchJournal = () => async (dispatch) => {
    const res = await dispatch(runQuery(fetchQuery))
    const entry = res.data.session.auth.journalEntry

    // Inflate dates
    entry.createdAt = new Date(entry.createdAt)
    entry.updatedAt = new Date(entry.updatedAt)
    entry.day = new Date(entry.day)
    entry.content = entry.content ? entry.content.map(part => ({
        ...part,
        createdAt: new Date(part.createdAt),
        updatedAt: new Date(part.updatedAt),
    })) : null

    return entry
}

export const saveJournal = (day, content) => async (dispatch) => {
    const res = await dispatch(runQuery(saveQuery, {
        day: formatDate(day),
        content,
    }))
    return res.data.session.auth.journalEntry
}
