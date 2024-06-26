import { autoDetect } from '@serialport/bindings-cpp';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import express from 'express';
import bodyParser from 'body-parser';
import { WebSocketServer } from 'ws';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const wss = new WebSocketServer({ port: 8080 });

let message = "";
let sent = false;
let clients = [];

// Handle WebSocket connections
wss.on('connection', (ws) => {
	clients.push(ws);
	console.log('New client connected');

	ws.on('close', () => {
		clients = clients.filter(client => client !== ws);
		console.log('Client disconnected');
	});
});

autoDetect()
	.list()
	.then(ports => {
		const port = ports.find(port => /arduino/i.test(port.manufacturer));
		if (!port) {
			console.error('Arduino Not found');
			process.exit(1);
		}

		console.log('Arduino found:', port.path);
		startLogging(port.path);
	})
	.catch(error => {
		console.error('Error detecting ports:', error);
		process.exit(1);
	});

function startLogging(portPath) {
	const port = new SerialPort({
		path: portPath,
		baudRate: 9600,
	});

	const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

	port.on('open', () => {
		console.log(`Serial port ${portPath} opened.`);
	});

	parser.on('data', (data) => {
		const trimmedData = data.trim();
		console.log(`Received data: ${trimmedData}`);
		message = trimmedData;
		broadcastMessage(trimmedData);
	});

	port.on('error', (err) => {
		console.error('Error on serial port:', err.message);
	});

	port.on('close', () => {
		console.log('Serial port closed.');
	});
}

function broadcastMessage(msg) {
	clients.forEach(client => {
		if (client.readyState === client.OPEN) {
			client.send(msg);
		}
	});
}

app.get('/status', (req, res) => {
	res.json({ message });
	if (message !== "") {setTimeout(() => {
		message = "";
	},950)}
});

app.listen(3000, () => {
	console.log('App listening on port 3000');
});
