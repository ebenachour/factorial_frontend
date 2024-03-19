import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';


ChartJS.register(...registerables);

const MetricsVisualization = () => {
    const [selectedMetric, setSelectedMetric] = useState('');
    const [metricsData, setMetricsData] = useState([]);
    const [formData, setFormData] = useState({
        metric_name: '',
        value: parseFloat(0),
        timestamp: ''
    });

    useEffect(() => {
        if (selectedMetric) {
            fetchMetrics(selectedMetric);
        }
    }, [selectedMetric]);

    const fetchMetrics = () => {
        axios.get(`/search?metric_name=${selectedMetric}`)
            .then(response => {
                setMetricsData((response.data.data.search_results));
            })
            .catch(error => {
                console.error('Error fetching metrics:', error);
            });
    };

    const groupMetrics = (metrics) => {
        const groupedMetrics = {};
        metrics.forEach(metric => {
            const { timestamp, value } = metric;
            if (!groupedMetrics[timestamp]) {
                groupedMetrics[timestamp] = [];
            }
            groupedMetrics[timestamp].push(value);
        });
        return groupedMetrics;
    };

    const handleMetricChange = (event) => {
        const selectedMetric = event.target.value;
        setSelectedMetric(selectedMetric);
        };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name == "value"){
            setFormData({ ...formData, [name]: parseFloat(value) });

        }else
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        sendMetrics(formData);
    };

    const sendMetrics = (data) => {
        axios.post('/metrics', data)
            .then(response => {
                console.log('Metrics sent successfully:', response.data);
                // Optionally, you can update the metrics visualization here
                // or fetch the updated data again
            })
            .catch(error => {
                console.error('Error sending metrics:', error);
            });
    }; 

    const chartData = {
            labels: metricsData.map(metric => new Date(metric.timestamp)),
    datasets: [
        {
            label: selectedMetric,
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 1,
            data: metricsData.map(metric => metric.value)
        }
    ]
        };

     return (
        <div>
            <h1>Metrics Visualization</h1>
            <div>
                <label>Select Metric:</label>
                <select onChange={handleMetricChange} value={selectedMetric}>
                    <option value="">-- Select Metric --</option>
                    <option value="foo">Metric 1</option>
                    <option value="bar">Metric 2</option>
                    {/* Add other metric options here */}
                </select>
            </div>
            <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input type="text"     name="metric_name" value={formData.metric_name} onChange={handleInputChange} required />
                <label>Value:</label>
                <input type="number" name="value" value={formData.value} onChange={handleInputChange} required />
                <label>Timestamp:</label>
                <input type="datetime-local" name="timestamp" value={formData.timestamp} onChange={handleInputChange} required />
                <button type="submit">Send Metric</button>
            </form>
            {Object.keys(metricsData).length > 0 && selectedMetric && (
                <div>
                    <Bar
                        data={chartData}
                        options={{
                            title: {
                                display: true,
                                text: 'Metrics Visualization',
                                fontSize: 20
                            },
                            legend: {
                                display: true,
                                position: 'top'
                            }
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default MetricsVisualization;