// What the Curtains page says about each curtain. Rates come from WW (public/js/data.js), never from here.
// Product advice is general guidance for Window Works to confirm before launch.
export const INFO = {
  sheers: {
    alt: 'White sheer curtains on a rod, letting soft daylight into a room',
    best: 'Living rooms and any window you want light through', light: 'See-through, softens the daylight',
    long: 'Light, see-through fabric that takes the glare off the sun and keeps the room private by day, without shutting out the light. Many homes hang sheers behind heavier curtains and use both.',
    rooms: ['living', 'bedroom', 'tall'], wants: ['soft'],
  },
  eyelet: {
    alt: 'Grey patterned eyelet curtains with metal rings on a rod beside a reading chair',
    best: 'Bedrooms and living rooms', light: 'Slides easily along the rod',
    long: 'Metal rings are punched into the top of the fabric and slide straight onto the rod, so the curtain falls in deep, even folds and opens with one pull. Clean and modern, and the most common choice.',
    rooms: ['bedroom', 'living'], wants: ['dark', 'easy'],
  },
  pleated: {
    alt: 'Olive green pleated curtains tied back on a living room window',
    best: 'Living and dining rooms', light: 'Tailored folds from a stitched top',
    long: 'Pleats are stitched into the top of the curtain, so the folds sit neat and regular all the way down. It gives a more tailored, formal look than eyelets.',
    rooms: ['living', 'dining'], wants: ['tailored', 'dark'],
  },
  recess: {
    alt: 'Floor-to-ceiling taupe curtains hung from a ceiling recess in a bedroom',
    best: 'New homes and rooms with a false ceiling', light: 'Runs from ceiling to floor',
    long: 'The track sits hidden in a recess in the ceiling, so the fabric runs from the ceiling to the floor with no rod in sight. It makes a room look taller and finished.',
    rooms: ['tall', 'bedroom', 'living'], wants: ['tailored', 'dark'],
  },
  led: {
    alt: 'Sheer curtains lit from above by a concealed strip of light in a living room at night',
    best: 'Living rooms and the evenings', light: 'Lit from above at night',
    long: 'A concealed strip of light runs above the curtain and washes down the fabric, so the window glows in the evening. It works best with sheers and lighter fabrics.',
    rooms: ['living', 'dining'], wants: ['glow'],
  },
  motorised: {
    alt: 'A hand holding a remote beside a motorised curtain track',
    best: 'Tall, wide or hard-to-reach windows', light: 'Opens and closes by remote',
    long: 'A motor in the track opens and closes the curtains by remote, which helps on tall glass, wide openings and windows behind furniture. The fabric is priced like any curtain; the motor is added on top.',
    rooms: ['tall', 'living'], wants: ['remote'],
  },
};

export const Q_WHERE = [['bedroom', 'Bedroom'], ['living', 'Living room'], ['dining', 'Dining room'], ['tall', 'Tall glass or double height']];
export const Q_WANT = [['dark', 'A darker room'], ['soft', 'Soft daylight'], ['tailored', 'A tailored look'], ['easy', 'Easy to open every day'], ['glow', 'A glow in the evening'], ['remote', 'Open by remote']];

export function suggest(curtains, where, want) {
  const score = (c) => (INFO[c.id].rooms.includes(where) ? 2 : 0) + (INFO[c.id].wants.includes(want) ? 3 : 0);
  return [...curtains].sort((a, b) => score(b) - score(a) || a.rate - b.rate).slice(0, 3);
}

export const faqs = (s, rates) => {
  const r = (id) => rates.find((c) => c.id === id).rate;
  const example = globalThis.WW.calc('curtains', { rate: 1 }, [{ w: 5, h: 7, unit: 'ft', qty: 1 }], s).lines[0].measure.replace(' m', ' metres');
  return [
    ['How much do curtains cost in Coimbatore?', `At Window Works, eyelet, pleated, recess and LED curtains start from ₹${r('eyelet')} per metre, and sheers from ₹${r('sheers')} per metre, all before GST. Motorised curtains add a motor from ₹${s.motorFrom.toLocaleString('en-IN')} plus GST. Enter your window size on this page to see a rough price for each one.`],
    ['How many metres of fabric does a window need?', `Roughly twice the window width in fabric, cut from ${s.fabricWidthIn}-inch rolls, with each width as long as the curtain plus ${s.hemFt} ft for the hems. A window 5 ft wide and 7 ft tall takes about ${example}.`],
    ['What is the difference between sheers and curtains?', 'Sheers are light and see-through: they soften the sun and keep the room private by day. Curtains are heavier and close the window off. Many homes hang both, sheers behind and curtains in front.'],
    ['Eyelet or pleated curtains?', 'Eyelet curtains slide on metal rings along a rod and fall in deep, even folds, for a clean, modern look. Pleated curtains have pleats stitched into the top, for a more tailored, formal finish.'],
    ['What are recess curtains?', 'Curtains hung from a track hidden in a recess in the ceiling, so the fabric runs from the ceiling to the floor with no rod showing.'],
    ['Do you stitch the curtains yourselves?', 'Yes. Our in-house tailors are from Northern India and come from families that have stitched for generations.'],
    ['Can curtains be printed with my own design?', 'Yes. Window Works was the first company to print curtains, sheers and blinds to the customer’s own choice, and has done so since 2015.'],
    ['Is the price on this page final?', 'No, it is a rough guide based on our starting rates, plus GST. Your fabric and fittings decide the final figure, and we confirm it after measuring at your home.'],
    ['Do you have a showroom?', 'No. We do not run an outlet, and that saving goes to you. We bring the catalogues to your home so you can see each fabric against your own walls.'],
  ];
};
