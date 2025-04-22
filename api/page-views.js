import { BetaAnalyticsDataClient } from '@google-analytics/data';

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
});

const propertyId = '400640057'; 

export default async function handler(req, res) {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '2024-01-01', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      dimensionFilter: {
        filter: {
          stringFilter: { value: '/home', matchType: 'EXACT' },
          fieldName: 'pagePath',
        },
      },
    });

    const views = response.rows?.[0]?.metricValues?.[0]?.value || '0';
    res.status(200).json({ views: parseInt(views, 10) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch GA views' });
  }
}
