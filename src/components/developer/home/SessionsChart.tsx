import 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

export const SessionsChart = ({ data, year }: {data: any, year: any}) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Sessions',
        data,
        borderColor: 'rgba(16,185,129,1)',
        backgroundColor: 'rgba(16,185,129,0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgba(16,185,129,1)',
        pointBorderColor: 'rgba(0,0,0,0.8)',
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: 'rgba(16,185,129,1)',
        pointHoverBorderWidth: 2,
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#6ee7b7',
        bodyColor: '#ffffff',
        borderColor: 'rgba(16,185,129,0.3)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { 
          color: 'rgba(255,255,255,0.05)',
          drawBorder: false
        },
        ticks: { 
          color: 'rgba(255,255,255,0.6)',
          font: {
            size: 10
          },
          padding: 8
        }
      },
      x: {
        grid: { 
          color: 'rgba(255,255,255,0.05)',
          drawBorder: false
        },
        ticks: { 
          color: 'rgba(255,255,255,0.6)',
          font: {
            size: 10
          },
          padding: 5
        }
      }
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-zinc-900/90 to-black/70 rounded-2xl backdrop-blur-md border border-zinc-800/50 shadow-xl overflow-hidden h-full"
    >
      <div className="p-4 border-b border-zinc-800/50 flex items-center gap-2">
      <span className='p-3 bg-gradient-to-br from-indigo-900/40 to-emerald-800/30 rounded-xl'>
          <Calendar className="w-4 h-4 text-emerald-400" />
          </span>
        <h3 className="font-medium text-white">Sessions ({year})</h3>
      </div>
      <div className="p-5">
        <div className="h-64">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </motion.div>
  );
};