import React, { useState } from 'react'
import Loading from '../components/Loading'
import RefreshButton from '../components/RefreshButton'
import { Form, Col, Row, Image, Card, CardDeck } from 'react-bootstrap'
import { useAuth0 } from '../utils/react-auth0-wrapper'
import { useConnections } from '../utils/connections'
import { get } from '../utils/api'

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadedData, setLoadedData] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const { getTokenSilently, impersonatedUser } = useAuth0();
  const { connections } = useConnections();

  // if in the middle of a loading loop, put up loading banner and bail
  if (loading && !refresh) {
    return <Loading />
  }

  // force load of profile data
  const loadData = async () => { 
    setLoading(true);
    setRefresh(true);

    const token = await getTokenSilently();
    const [response, error] = await get(token, 'profile', 
      impersonatedUser ?  { impersonatedUser: impersonatedUser } : {});

    if (error || !response.ok) {
      setLoadedData(true);
      setLoading(false);
      setRefresh(false);
      setProfile(response);
      return;
    }

    const responseData = await response.json();
    setLoadedData(true);
    setLoading(false);
    setRefresh(false);
    setProfile(responseData);
  };

  // if haven't loaded profile yet, do so now
  if (!loadedData && !loading) {
    loadData();
  }

  const name = profile && profile.name;
  const email = profile && profile.email;
  const picture = profile && profile.picture;
  const lastLogin = profile && profile.last_login && new Date(profile.last_login).toLocaleString();

  const connectionCards = profile && profile.identities && 
        connections && connections.map && connections.map(connection => {
    // set up some variables
    const connected = connection.connected ? true : false;
    const color = connected ? 'success' : 'danger';
    const [providerTitle] = connection.provider.split('-');
    const label = <i className={`fa fa-fw fa-${providerTitle} text-${color}`} style={{ fontSize: '1.2em' }} />;
    const provider = profile.identities.find(p => p.provider === connection.provider);
    console.log(provider)
    const userName = provider && provider.profileData && provider.profileData.name || name;
    const userPicture = provider && provider.profileData && provider.profileData.picture || picture;
    const screenName = provider && provider.profileData && provider.profileData.screen_name;
    const location = provider && provider.profileData && provider.profileData.location;

    return {
      connected,
      color,
      providerTitle,
      label,
      userName,
      userPicture,
      screenName,
      location
    }
  });

  return(
    <div style={{
      marginLeft: 20,
      padding: '1px 0 0 20px',
      textAlign: 'left',
      width: 'calc(100vw - 60px)'
    }}>
      <div className="provider-header">
        <RefreshButton load={loadData} loading={refresh}/>
        <h4 className="provider-title">Profile</h4>
      </div>
      { 
        loadedData && 
        <div>
          <Card>
            <Form>
              <Row>
                <Col sm="9">
                  <Card.Title style={{ margin: 20 }}>Name: {name}</Card.Title>
                  <Card.Title style={{ margin: 20 }}>Email: {email}</Card.Title>
                  <Card.Title style={{ margin: 20 }}>Last login: {lastLogin}</Card.Title>
                </Col>
                <Col sm="3">
                  <Image src={picture} style={{ height: 120, width: 120, margin: 20 }} roundedCircle />
                </Col>
              </Row>
            </Form> 
          </Card> 

          <CardDeck style={{ padding: 20 }}>
          { 
            connectionCards && connectionCards.map((connection, key) => {
              console.log(connection)
              return (
                <Card 
                  key={key} 
                  className='mx-auto'
                  border={connection.color}
                  style={{ maxWidth: '200px', minWidth: '200px', minHeight: '150px', textAlign: 'center' }}>
                  <Card.Header>{connection.label}</Card.Header>
                  <Card.Body>
                    <Card.Title>{ connection.connected && connection.userName }</Card.Title>
                    { connection.connected && connection.userPicture && 
                      <center><Card.Img variant="top" src={connection.userPicture} style={{ width: '6rem', margin: '10px' }}/></center>
                    }
                    { connection.connected && connection.screenName && <Card.Subtitle><p>@{connection.screenName}</p></Card.Subtitle> }
                    { connection.connected && connection.location && <Card.Subtitle>{connection.location}</Card.Subtitle> }
                  </Card.Body>
                </Card>    
              )
            })
          }
          </CardDeck>               
        </div>
      }
    </div>
  )
}

export default ProfilePage