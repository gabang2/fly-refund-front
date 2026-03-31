const ADJECTIVES = [
  'Swift', 'Bold', 'Brave', 'Cool', 'Bright', 'Sharp', 'Quick', 'Calm',
  'Wise', 'Keen', 'Epic', 'Free', 'Wild', 'Sunny', 'Lucky', 'Grand',
  'Sleek', 'Nimble', 'Daring', 'Stellar',
];

const NOUNS = [
  'Falcon', 'Eagle', 'Pilot', 'Flyer', 'Voyager', 'Hawk', 'Jet', 'Wing',
  'Comet', 'Drifter', 'Glider', 'Nomad', 'Ranger', 'Skipper', 'Cruiser',
  'Racer', 'Rider', 'Roamer', 'Scout', 'Traveler',
];

export function generateNickname(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${adj}${noun}${num}`;
}
