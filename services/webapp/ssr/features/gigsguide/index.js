/* eslint-disable */

import { EXPRESS_ROUTE } from '@forrestjs/service-express'
import { FEATURE_NAME } from './hooks'
import sm from 'sitemap'

export const register = ({ registerAction }) => {
    registerAction({
        hook: EXPRESS_ROUTE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: ({ app }) => app.get('/sitemap.xml', async (req, res) => {

            const rrr = await fetch('http://localhost:8080/api', {
                method: 'POST',
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    query: '{ GigsGuide { events (city:"malmo" startDate:"2019-07-01" endDate:"2019-07-14") { _id }}}'
                }),
            })
            const data = await rrr.json()

            const sitemap = sm.createSitemap ({
                hostname: 'http://example.com',
                cacheTime: 600000,        // 600 sec - cache purge period
                urls: data.data.GigsGuide.events.map(event => ({
                    url: `/${event._id}`,
                    changefreq: 'daily', priority: 0.3
                }))
              })

            sitemap.toXML( function (err, xml) {
                if (err) {
                  return res.status(500).end();
                }
                res.header('Content-Type', 'application/xml');
                res.send( xml );
            });
        }),
    })
}

