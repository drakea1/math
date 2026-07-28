import OperationsMapClient from './OperationsMapClient';

export async function generateStaticParams() {
  return [
    { subjectId: 'addition' },
    { subjectId: 'subtraction' },
    { subjectId: 'multiplication' },
    { subjectId: 'division' },
    { subjectId: 'pre-algebra' },
    { subjectId: 'algebra' },
    { subjectId: 'algebra2' },
    { subjectId: 'geometry' },
    { subjectId: 'pre-calc' },
    { subjectId: 'statistics' },
    { subjectId: 'calculus' },
  ];
}

export default async function Page(props) {
  const params = await props.params;
  const subjectId = params.subjectId;

  return <OperationsMapClient subjectId={subjectId} />;
}