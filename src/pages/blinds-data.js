// What the Blinds page says about each blind. Rates come from WW (public/js/data.js), never from here.
// Product advice is general guidance for Window Works to confirm before launch.
export const INFO = {
  vertical: {
    alt: 'Pale grey vertical blinds parted on a tall sliding glass door',
    best: 'Tall windows, sliding doors and offices', light: 'Slats turn, and slide aside',
    long: 'Long slats hang from a track and part to one side. They suit tall or wide glass, because you can open only the part you walk through. This is our lowest starting rate.',
    rooms: ['office', 'door', 'living'], wants: ['tilt', 'open'],
  },
  roller: {
    alt: 'An ivory roller blind half lowered on a bedroom window',
    best: 'Bedrooms and everyday windows', light: 'Blackout fabric for a dark room',
    long: 'One flat sheet of fabric rolls up out of sight, so the window looks clean when it is open. Choose a blackout fabric when a room needs to go properly dark.',
    rooms: ['bedroom', 'office', 'living'], wants: ['dark'],
  },
  zebra: {
    alt: 'Cream zebra blinds casting soft stripes of light in a dining room',
    best: 'Living rooms, dining rooms and bedrooms', light: 'Bands slide from open to closed',
    long: 'Sheer and solid bands slide past each other. Line the sheer bands up for daylight and a view, or the solid bands for privacy, without lifting the blind.',
    rooms: ['living', 'bedroom', 'office'], wants: ['soft', 'tilt'],
  },
  venetian: {
    alt: 'Slim aluminium venetian blinds tilted half open on a study window',
    best: 'Studies and offices', light: 'Tilt the slats to any angle',
    long: 'Horizontal slats tilt to let in exactly as much light as you want, so you can stop glare on a screen and still see outside.',
    rooms: ['office', 'living'], wants: ['tilt'],
  },
  roman: {
    alt: 'A beige linen Roman blind folded in even pleats above a living room window',
    best: 'Living and dining rooms', light: 'Fabric lifts in soft folds',
    long: 'Soft fabric folds up in neat, even pleats and stays on show when the blind is open. It brings the warmth of a curtain to a window that has no room for one.',
    rooms: ['living', 'bedroom'], wants: ['soft'],
  },
  wooden: {
    alt: 'Teak-coloured wooden blinds tilted half open beside a bookshelf',
    best: 'Studies and living rooms', light: 'Tilt the slats to any angle',
    long: 'Wide wooden slats give a warm, solid look that sits well with teak furniture and wooden floors. Tilt them through the day to follow the sun.',
    rooms: ['office', 'living', 'bedroom'], wants: ['tilt'],
  },
  monsoon: {
    alt: 'A translucent monsoon blind lowered on a veranda during light rain',
    best: 'Balconies and verandas', light: 'Keeps rain out, lets light in',
    long: 'Waterproof outdoor blinds for the balconies and verandas that catch the rain. Lower them when the weather turns, and roll them away when it clears.',
    rooms: ['outdoor'], wants: ['open', 'soft'], outdoor: true,
  },
  honeycomb: {
    alt: 'A white honeycomb blind with its pleated cells showing along the lower edge',
    best: 'Bedrooms and rooms that catch the sun', light: 'Soft, filtered light',
    long: 'Pleated cells hold a layer of air against the window, for softer light and a cooler room. This is our energy-saving choice for rooms that catch the afternoon sun.',
    rooms: ['bedroom', 'living'], wants: ['soft', 'dark'],
  },
  panel: {
    alt: 'Warm grey fabric panels overlapping on a floor-to-ceiling sliding door',
    best: 'Wide glass and sliding doors', light: 'Panels glide along a track',
    long: 'Wide fabric panels glide along a track and stack neatly to one side. They make a calm, modern wall of fabric across a large opening.',
    rooms: ['door', 'living', 'office'], wants: ['open', 'soft'],
  },
  zipper: {
    alt: 'A dark external zipper blind half lowered around a covered terrace',
    best: 'Terraces, patios and sit-outs', light: 'Weatherproof, held in side channels',
    long: 'Outdoor blinds zipped into metal side channels, so the fabric holds against wind and weather. They turn a terrace or sit-out into a room you can use all year.',
    rooms: ['outdoor'], wants: ['open', 'dark'], outdoor: true,
  },
  insulated: {
    alt: 'Slim slatted blinds sealed inside a double-glazed window',
    best: 'Glass doors and glass partitions', light: 'Raises and lowers inside the glass',
    long: 'The blind is built into the glass unit, so there is nothing to dust and nothing for hands to catch. It suits glass doors and partitions that need to stay spotless.',
    rooms: ['door', 'office'], wants: ['tilt', 'open'],
  },
};

export const GROUPS = [
  { title: 'For everyday rooms', note: 'Simple to use and easy on the budget, for bedrooms, living rooms and offices.', ids: ['vertical', 'roller', 'zebra', 'venetian'] },
  { title: 'For a warmer room', note: 'Fabric folds, a wooden look and softer light, for the rooms you spend your evenings in.', ids: ['roman', 'wooden', 'honeycomb'] },
  { title: 'For big glass and the outdoors', note: 'Built for wide openings, terraces, verandas and the rain.', ids: ['monsoon', 'panel', 'insulated', 'zipper'] },
];

export const Q_WHERE = [['bedroom', 'Bedroom'], ['living', 'Living or dining room'], ['office', 'Study or office'], ['door', 'Tall glass or sliding door'], ['outdoor', 'Balcony or terrace']];
export const Q_WANT = [['dark', 'A darker room'], ['soft', 'Soft daylight'], ['tilt', 'Control through the day'], ['open', 'A clear opening when it is up']];
export const Q_BUDGET = [['low', 'Keep the cost low'], ['any', 'Happy with either'], ['look', 'The look matters most']];

export function suggest(blinds, where, want, budget) {
  const pool = blinds.filter((b) => (where === 'outdoor' ? INFO[b.id].outdoor : !INFO[b.id].outdoor));
  const score = (b) => (INFO[b.id].rooms.includes(where) ? 3 : 0) + (INFO[b.id].wants.includes(want) ? 2 : 0)
    + (budget === 'low' && b.rate <= 150 ? 1 : 0) + (budget === 'look' && b.rate >= 225 ? 1 : 0);
  return [...pool].sort((a, b) => score(b) - score(a) || a.rate - b.rate).slice(0, 3);
}

export const VIDEOS = [
  ['AIU1LYDOvPY', 'Jumbo Roman blinds'],
  ['Ruzhotl_yUw', 'Honeycomb blinds'],
  ['N9EtkCqD3KQ', 'Weatherproof zipper blinds'],
  ['L4cqZRJlWSI', 'Motorised patio blinds'],
  ['F3_9vdSg7_s', 'Quality check at our factory'],
];

export const faqs = (s) => [
  ['How much do window blinds cost in Coimbatore?', 'At Window Works, blinds start from ₹55 per sq ft for vertical blinds and ₹80 for roller blinds, up to ₹1,200 for insulated glass blinds, all before GST. Enter your window size on this page to see a rough price for every type.'],
  ['What are the cheapest blinds?', 'Vertical blinds have our lowest starting rate at ₹55 per sq ft, followed by roller blinds at ₹80 and zebra blinds at ₹120, before GST.'],
  ['Which blinds make a bedroom dark?', 'Roller blinds in a blackout fabric are the usual choice. Honeycomb blinds are a softer option that also help keep a sunny room cooler.'],
  ['Which blinds can go outdoors or take rain?', 'Monsoon blinds are made for balconies and verandas that catch the rain. External zipper blinds are held in side channels against wind and weather, for terraces and patios.'],
  ['Do you have a showroom?', 'No. We do not run an outlet, and that saving goes to you. We bring the catalogues to your home so you can see each fabric against your own walls.'],
  ['Is the price on this page final?', 'No, it is a rough guide based on our starting rates, plus GST. Your fabric and fittings decide the final figure, and we confirm it after measuring at your home.'],
  ['Is there a minimum size?', `For the rough price, any blind smaller than ${s.minArea} sq ft is counted as ${s.minArea} sq ft.`],
  ['Can blinds be printed with my own design?', 'Yes. Window Works prints blinds, curtains and sheers to your own theme, with a range of designs to match your room.'],
  ['Can blinds be motorised?', 'Yes, we have fitted motorised blinds, including on patios. Ask our team what suits your window, as the cost depends on the blind and its size.'],
];
