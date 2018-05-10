import DataQuery from './DataQuery';

const data = [
  {
    name: 'Matt',
    team: {
      name: 'Pleased Property',
      counts: {
        staff: 3,
      },
      skills: [
        { name: 'backend' }, { type: 'infrastructure' },
      ],
    },
  },
  {
    name: 'Callan',
    team: {
      name: 'Pleased Property',
      counts: {
        staff: 3,
      },
      skills: [
        { name: 'frontend' },
      ],
    },
  },
  {
    name: 'Loris',
    team: {
      name: 'Genny',
      counts: {
        staff: 12,
        bob: 100,
      },
      skills: [
        { name: 'frontend' }, { name: 'backend' }, { name: 'mobile' },
      ],
    },
  },
];

const query = [
  {
    operator: 'find',
    query: {
      team: {
        counts: {
          staff: { $gt: 0 },
        },
      },
    },
    projection: {
      name: true,
    },
  },
  {

    operator: 'distinct',
    field: 'name',
  },
];

window.testQuery = () => {
  const dataQuery = new DataQuery( data );
  const result = dataQuery.query( query );
  return result;
};
