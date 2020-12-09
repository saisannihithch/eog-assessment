import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IState } from '../store';
import { CardContent, Typography, Card } from '@material-ui/core';
import { useSubscription, useQuery } from 'urql';
import { actions } from '../Features/Metrics/reducer';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  card: {
    width: "40%",
    marginRight: "1rem",
    marginBottom: "1rem"
  }
});

interface ILatestValueSectionProps {
  selectedMetrics: string[];
}

interface IValueCardProps {
  metricName: string;
  currentValue: number;
}

const ValueCard: React.FC<IValueCardProps> = ({ metricName, currentValue }) => {
  const [value, setValue] = useState(currentValue);
  const [result] = useQuery({
    query: `query ($metricName: String!) {
            getLastKnownMeasurement(metricName:$metricName){
              metric
              value
              at
              unit
            }
          }`,
    variables: {
      metricName,
    },
  });
  const { data } = result;
  const classes = useStyles();
  useEffect(() => {
    setValue(data ? data.getLastKnownMeasurement.value : 0);
  }, [data]);
  return (

    <Card className={classes.card}>
      <CardContent>
        <Typography variant={"h6"}>{metricName}</Typography>
        <Typography variant={"h3"}>{currentValue ? currentValue : value}</Typography>
      </CardContent>
    </Card>
  );
};

const getLatestValues = (state: IState) => {
  return state.metrics.latestValue;
};

interface NewMeasurement {
  newMeasurement: {
    at: string;
    metric: string;
    value: number;
    unit: string;
  };
}

const LatestValueSection: React.FC<ILatestValueSectionProps> = ({ selectedMetrics }) => {
  const latestValue = useSelector(getLatestValues);
  const dispatch = useDispatch();
  const [result] = useSubscription<NewMeasurement>({
    query: `
        subscription {
            newMeasurement {
                at
                metric
                value
                unit
            }
        }`,
    pause: selectedMetrics.length === 0,
  });
  const { data } = result;

  useEffect(() => {
    data && dispatch(actions.fetchedSingleMetric(data.newMeasurement));
  }, [data, dispatch]);

  return (
    <>
      {selectedMetrics.map(metric => (
        <ValueCard key={metric} metricName={metric} currentValue={latestValue[metric]} />
      ))}
    </>
  );
};

export default LatestValueSection;
