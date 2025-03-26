const express = require('express');
const { AccessToken } = require('livekit-server-sdk')
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


app.post('/api/sandbox/connection-details', async (req, res) => {
	const roomName = req.query.roomName || "defaultRoom";
	const participantName = req.query.participantName || "defaultParticipant";
	
	const at = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, 
	{
		identity: participantName,
		ttl: 3600
	});
	
	at.addGrant({ roomJoin: true, room: roomName, roomJoin: true,
  canPublish: true,
  canSubscribe: true,
  canUpdateOwnMetadata: true,
  canPublishData: true,
  roomCreate: true,
  });
	
	const token = await at.toJwt();
	
	const responseJson = {
		participantToken: token,
		roomName: roomName,
		serverUrl: process.env.LIVEKIT_SERVER_URL,
		participantName: participantName
	};
	
	res.json(responseJson);
});


app.listen(port, () => {
	console.log('Token server is listening on port ' + port);
});