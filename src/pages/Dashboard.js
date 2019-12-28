import React from 'react'
import Loading from '../components/Loading'
import RefreshButton from '../components/RefreshButton'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import CardDeck from 'react-bootstrap/CardDeck'
import HighlightCard from '../components/HighlightCard'
import { useConnections } from '../utils/connections'
import { useMetadata } from '../utils/metadata'
import { navigate } from 'hookrouter'

const Dashboard = () => {
  const { loading: loadingMetadata, metadata, loadMetadata } = useMetadata();
  const { loading: loadingConnections, connections } = useConnections();
  const loading = loadingMetadata || loadingConnections;
  const pageTitle = 'Dashboard';

  if ((!metadata && loadingMetadata) ||
      (!connections && loadingConnections)) {
    return <Loading />
  }

  const sentimentValues = ['positive', 'neutral', 'negative'];
  const sentimentColors = ['#28a745', '#ffc107', '#dc3545'];
  const sentimentBorders = ['success', 'warning', 'danger'];
  const sentimentIcons = [
    'fa fa-thumbs-up fa-2x text-success', 
    'fa fa-minus fa-2x text-warning',
    'fa fa-thumbs-down fa-2x text-danger'
  ];

  // compute the pie data across all the providers
  const sentiments = metadata && sentimentValues.map((val, index) => {
    return (
      {
        label: <i className={sentimentIcons[index]} style={{ fontSize: '1.2em' }} />,
        color: sentimentColors[index],
        border: sentimentBorders[index],
        title: val,
        value: metadata.filter(m => m.__sentiment === val).length
      }
    )
  });

  const unhandledFeedback = metadata && connections && connections.map(c => 
    metadata.filter(a => a.__handled !== true && a.provider === c.provider).length);

  const sentimentScores = metadata && connections && connections.map(c => {
    const array = metadata.filter(m => m.provider === c.provider);
    const count = array.length;
    if (count === 0) {
      return -1;
    }
    const scoreArray = array.map(m => m.__sentimentScore);
    const totalScore = scoreArray.reduce((acc, val) => acc + val, 0);
    const average = totalScore / count;
    const finalScore = Math.round(average * 100 + 50);
    return finalScore;
  });
  
  return (
    <div>
      <div className="provider-header">
        <RefreshButton load={loadMetadata} loading={loading}/>
        <h4 className="provider-title">{pageTitle}</h4>
      </div>
      <CardDeck style={{padding: 25}}>
        <HighlightCard
          onClick={ () => { navigate('/sources/connections')} }
          className='mx-auto'
          text='white'
          style={{ maxWidth: '400px', minWidth: '400px', textAlign: 'center', marginBottom: 10 }}>
          <Card.Header style={{ background: '#ff7777'}} as="h5">Reputation sources</Card.Header>
          <Card.Body>
            <CardDeck>
            {
              connections && connections.map ? connections.map((connection, key) => {
                // set up some variables
                const connected = connection.connected ? true : false;
                const color = connected ? 'success' : 'danger';
                const [providerTitle] = connection.provider.split('-');
                const label = <i className={`fa fa-fw fa-${providerTitle} text-${color}`} style={{ fontSize: '1.2em' }} />
                return (
                  <Card 
                    key={key} 
                    className='mx-auto'
                    border={color}
                    style={{ maxWidth: '80px', minWidth: '80px', minHeight: '80px', textAlign: 'center' }}>
                    <Card.Body>
                      <Card.Title>{label}</Card.Title>
                    </Card.Body>
                  </Card>    
                )
              })
            : <div/>
            }
            </CardDeck>
          </Card.Body>
          <Card.Footer style={{ background: 'white'}}>
            <Button onClick={ () => { navigate('/sources/connections')}}>Connect more sources!</Button>
          </Card.Footer>
        </HighlightCard>

        <HighlightCard
          onClick={ () => { navigate('/reputation/summary')} }
          className='mx-auto'
          text='white'
          style={{ maxWidth: '400px', minWidth: '400px', textAlign: 'center', marginBottom: 10 }}>
          <Card.Header style={{ background: '#ff7777'}} as="h5">Reputation summary</Card.Header>
          <Card.Body>
            <CardDeck>
            {
              sentiments && sentiments.map ? sentiments.map((sentiment, key) => {
                // set up some variables
                return (
                  <Card 
                    key={key} 
                    className='mx-auto'
                    border={sentiment.border}
                    style={{ maxWidth: '80px', minWidth: '80px', maxHeight: '80px', minHeight: '100px', textAlign: 'center' }}>
                    <Card.Body>
                      <Card.Title>{sentiment.label}</Card.Title>
                      <Card.Title style={{ color: 'gray' }}>{sentiment.value}</Card.Title>
                    </Card.Body>
                  </Card>    
                )
              })
            : <div/>
            }
            </CardDeck>
          </Card.Body>
          <Card.Footer style={{ background: 'white'}}>
            <Button onClick={ () => { navigate('/reputation/summary')}}>Check out reputation!</Button>
          </Card.Footer>
        </HighlightCard>        
      </CardDeck>

      <CardDeck style={{padding: 25}}>
        <HighlightCard
          onClick={ () => { navigate('/reputation/alerts')} }
          className='mx-auto'
          text='white'
          style={{ maxWidth: '400px', minWidth: '400px', textAlign: 'center', marginBottom: 10 }}>
          <Card.Header style={{ background: '#ff7777'}} as="h5">Unhandled feedback</Card.Header>
          <Card.Body>
            <CardDeck>
            {
              connections && connections.map && sentiments && sentiments.map ? 
                connections.map((connection, index) => {
                // set up some variables
                const [providerTitle] = connection.provider.split('-');
                const label = <i className={`fa fa-fw fa-${providerTitle} text-muted`} style={{ fontSize: '1.2em' }} />
                const value = unhandledFeedback[index];
                return (
                  <Card 
                    key={index} 
                    className='mx-auto'
                    style={{ maxWidth: '80px', minWidth: '80px', maxHeight: '80px', minHeight: '100px', textAlign: 'center' }}>
                    <Card.Body style={{padding: 15}}>
                      <Card.Title>{label}</Card.Title>
                      <Card.Title style={{ color: 'gray' }}>{value}</Card.Title>
                    </Card.Body>
                  </Card>    
                )
              })
            : <div/>
            }
            </CardDeck>
          </Card.Body>
          <Card.Footer style={{ background: 'white'}}>
            <Button onClick={ () => { navigate('/reputation/alerts')}}>Handle some feecback!</Button>
          </Card.Footer>
        </HighlightCard>     

        <HighlightCard
          onClick={ () => { navigate('/reputation/history')} }
          className='mx-auto'
          text='white'
          style={{ maxWidth: '400px', minWidth: '400px', textAlign: 'center', marginBottom: 10 }}>
          <Card.Header style={{ background: '#ff7777'}} as="h5">Reputation scores by source</Card.Header>
          <Card.Body>
            <CardDeck>
            {
              connections && connections.map ? connections.map((connection, index) => {
                // set up some variables
                const score = sentimentScores[index];
                const color = score === -1 ? 'white' : score > 70 ? 'success' : score < 30 ? 'danger' : 'warning';
                const [providerTitle] = connection.provider.split('-');
                const label = <i className={`fa fa-fw fa-${providerTitle} text-muted`} style={{ fontSize: '1.2em' }} />
                return (
                  <Card 
                    key={index} 
                    className='mx-auto'
                    border={color}
                    style={{ maxWidth: '80px', minWidth: '80px', minHeight: '100px', maxHeight: '100px', textAlign: 'center' }}>
                    <Card.Body style={{padding: 15}}>
                    <Card.Title>{label}</Card.Title>
                    <Card.Title style={{ color: 'gray' }}>{score === -1 ? 'none' : score}</Card.Title>
                    </Card.Body>
                  </Card>    
                )
              })
            : <div/>
            }
            </CardDeck>
          </Card.Body>
          <Card.Footer style={{ background: 'white'}}>
            <Button onClick={ () => { navigate('/reputation/history')}}>Check out history!</Button>
          </Card.Footer>
        </HighlightCard>           
      </CardDeck>
    </div>
  )
}

export default Dashboard

