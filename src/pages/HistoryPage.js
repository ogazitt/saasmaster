import React, { useState } from 'react'
import Loading from '../components/Loading'
import CheckboxGroup from '../components/CheckboxGroup'
import StackedAreaChart from '../components/StackedAreaChart'
import StackedLineChart from '../components/StackedLineChart'
import RefreshButton from '../components/RefreshButton'

import { useAuth0 } from '../utils/react-auth0-wrapper'
import { get } from '../utils/api'

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadedData, setLoadedData] = useState(false);
  const [checkboxState, setCheckboxState] = useState();
  const [refresh, setRefresh] = useState(false);
  const [providers, setProviders] = useState();

  const { getTokenSilently, impersonatedUser } = useAuth0();

  // if in the middle of a loading loop, put up loading banner and bail
  if (loading && !refresh) {
    return <Loading />
  }

  // load history data
  const loadData = async () => { 
    setLoading(true);
    setRefresh(true);

    const token = await getTokenSilently();
    const [response, error] = await get(token, 'history', 
      impersonatedUser ?  { impersonatedUser: impersonatedUser } : {});

    if (error || !response.ok) {
      setLoadedData(true);
      setLoading(false);
      setRefresh(false);
      setHistory(null);
      return;
    }

    const responseData = await response.json();
    setLoadedData(true);
    setLoading(false);
    setRefresh(false);
    setHistory(responseData);
  };

  // if haven't loaded profile yet, do so now
  if (!loadedData && !loading) {
    loadData();
    return;
  }

  // can't proceed until we've received the history
  if (!history || !history.length > 0) {
    return null;
  }

  const sentimentValues = ['negative', 'neutral', 'positive'];
  const colors = ['#dc3545', '#ffc107', '#28a745'];

  // get the set of unique providers returned in metadata, if haven't yet
  if (!providers && history && history.length > 0) {
    const set = new Set();
    for (const h of history) {
      const keys = Object.keys(h).filter(k => 
        k !== 'timestamp' && k !== 'averageScore' && 
        !sentimentValues.find(v => v === k));
      keys.forEach(set.add, set);
    }
    setProviders(Array.from(set));
    return;
  }

  // if haven't initialized the state yet, set it now
  if (!checkboxState && history.length > 0 && providers && providers.length > 0) {
    // create item list - one for each connection
    const items = {};
    for (const p of providers) {
      // take first element of name in the format like google-oauth2
      const [providerTitle] = p.split('-');
      items[p] = { 
        name: `dashboardCB-${p}`,
        title: providerTitle,
        state: true
      }
    }
    setCheckboxState(items);
  }

  // can't proceed until we've created the checkboxState
  if (!checkboxState) {
    return;
  }

  // event handler for checkbox group
  const onSelect = (event) => {
    // make a copy of state
    const items = { ...checkboxState };

    // checkbox name is in the form `dashboardCB-${name}`
    const name = event.target.name && event.target.name.split('dashboardCB-')[1];
    if (name && items[name]) {
      items[name].state = !items[name].state;
      setCheckboxState(items);
    }
  }

  // create the checked providers list
  const checkedProviders = providers && providers.filter(p => checkboxState[p].state);

  // set up areas definitions and data for all sentiment stacked column charts

  // areas for StackedAreaChart showing composite of all sentiments over time
  const areas = sentimentValues.map((sentiment, index) => {
    return {
      dataKey: sentiment,
      stackId: "a",
      fill: colors[index]
    }
  });

  // prepare data by converting timestamp to a date
  var options = { year: '2-digit', month: '2-digit', day: '2-digit' };  
  const allData = history.map(h => { 
    const date = new Date(h.timestamp).toLocaleDateString("en-US", options)
    return { ...h, date }
  });

  // create an array of provider-specific data
  const providerDataArray = checkedProviders && checkedProviders.map(provider => 
    allData.map(d => {
      return { ...d[provider], date: d.date, provider }
    })
  );
  
  // set up lines definitions and data for sentiment score line chart

  // lines for StackedLineChart showing sentiment scores over time
  const providerColors = ['#8884d8', "#82ca9d", '#dc3545']
  const lines = checkedProviders && checkedProviders.map((provider, index) => {
    return {
      dataKey: provider,
      stroke: providerColors[index]
    }
  });
  // add the line for the total composite score
  lines && lines.push({
    dataKey: 'all',
    stroke: 'blue'
  });

  // prepare data for sentiment score line chart
  const sentimentLineData = allData.map(d => {
    const entry = { date: d.date };
    for (const p of checkedProviders) {
      entry[p] = Math.round(d[p].averageScore * 100 + 50);
    }
    entry.all = Math.round(d.averageScore * 100 + 50);
    return entry;
  });
  
  return(
    <div>
      <div className="provider-header">
        <RefreshButton load={loadData} loading={refresh}/>
        <h4 className="provider-title">Sentiment history</h4>
        <div style={{ marginLeft: 50 }}>
          <CheckboxGroup 
            state={checkboxState}
            onSelect={onSelect}
          />
        </div>
      </div>
      <div style={{ display: 'flex', overflowX: 'hidden' /* horizontal layout */ }}> 
        <StackedAreaChart 
            data={allData}
            dataKey="date"
            areas={areas}
            width={500}
            height={300}
            margin={{ top: 20, right: 40, left: 0, bottom: 0 }}
            />
        <StackedLineChart 
          data={sentimentLineData}
          dataKey="date"
          lines={lines}
          width={500}
          height={300}
          margin={{ top: 20, right: 40, left: 0, bottom: 0 }}
          />
      </div>
      <div style={{ display: 'flex', marginTop: 20, overflowX: 'hidden' /* horizontal layout */ }}> 
        { 
          providerDataArray && providerDataArray.map((p, index) => 
            <div key={checkedProviders[index]}>
              <StackedAreaChart 
                key={checkedProviders[index]}
                data={p}
                dataKey="date"
                areas={areas}
                width={350}
                height={250}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                />
              <center style={{ marginTop: 10, marginBottom: 10 }}>
                <i className={`fa fa-fw fa-${checkedProviders[index]} text-muted`} style={{ fontSize: '1.75em' }} />
              </center>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default HistoryPage