import React from 'react';
import { UsageStats } from '@/types/flashcard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Layers, 
  Clock, 
  BookOpen, 
  TrendingUp, 
  ArrowLeft,
  Zap,
  Target
} from 'lucide-react';

interface AnalyticsDashboardProps {
  stats: UsageStats;
  onBack: () => void;
}

const COLORS = ['#25343F', '#4E6475', '#AEB9C2', '#BFC9D1'];

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ stats, onBack }) => {
  // Prepare data for pie chart
  const pieData = [
    { name: 'Studied', value: stats.cardsStudiedToday },
    { name: 'Remaining', value: Math.max(0, stats.totalCards - stats.cardsStudiedToday) },
  ];

  const statCards = [
    {
      title: 'Total Decks',
      value: stats.totalSets,
      icon: Layers,
      color: 'bg-primary',
    },
    {
      title: 'Total Cards',
      value: stats.totalCards,
      icon: BookOpen,
      color: 'bg-secondary',
    },
    {
      title: 'Study Sessions',
      value: stats.totalStudySessions,
      icon: Target,
      color: 'bg-accent',
    },
    {
      title: 'Time Spent',
      value: `${stats.totalTimeSpent}m`,
      icon: Clock,
      color: 'bg-muted',
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Usage Analytics</h1>
          <p className="text-muted-foreground mt-1">Track your learning progress and study habits</p>
        </div>
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} className="border-border shadow-soft hover:shadow-elevated transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Activity Chart */}
        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingUp className="h-5 w-5 text-secondary" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.weeklyProgress}>
                  <defs>
                    <linearGradient id="colorCards" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4E6475" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4E6475" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#BFC9D1" opacity={0.5} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#4E6475', fontSize: 12 }}
                    axisLine={{ stroke: '#BFC9D1' }}
                  />
                  <YAxis 
                    tick={{ fill: '#4E6475', fontSize: 12 }}
                    axisLine={{ stroke: '#BFC9D1' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #BFC9D1',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(37, 52, 63, 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cardsStudied" 
                    stroke="#4E6475" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorCards)" 
                    name="Cards Studied"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Time Spent Chart */}
        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Clock className="h-5 w-5 text-secondary" />
              Time Spent (minutes)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#BFC9D1" opacity={0.5} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#4E6475', fontSize: 12 }}
                    axisLine={{ stroke: '#BFC9D1' }}
                  />
                  <YAxis 
                    tick={{ fill: '#4E6475', fontSize: 12 }}
                    axisLine={{ stroke: '#BFC9D1' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #BFC9D1',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(37, 52, 63, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="timeSpent" 
                    fill="#25343F" 
                    radius={[4, 4, 0, 0]}
                    name="Minutes"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Circle */}
        <Card className="border-border shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Zap className="h-5 w-5 text-secondary" />
              Today's Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{stats.cardsStudiedToday}</p>
              <p className="text-sm text-muted-foreground">cards studied today</p>
            </div>
          </CardContent>
        </Card>

        {/* Sessions Chart */}
        <Card className="border-border shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Target className="h-5 w-5 text-secondary" />
              Daily Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#BFC9D1" opacity={0.5} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#4E6475', fontSize: 12 }}
                    axisLine={{ stroke: '#BFC9D1' }}
                  />
                  <YAxis 
                    tick={{ fill: '#4E6475', fontSize: 12 }}
                    axisLine={{ stroke: '#BFC9D1' }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #BFC9D1',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(37, 52, 63, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="sessions" 
                    fill="#4E6475" 
                    radius={[4, 4, 0, 0]}
                    name="Sessions"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty State Message */}
      {stats.totalStudySessions === 0 && (
        <Card className="mt-8 border-dashed border-2 border-border bg-muted/20">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No study data yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start studying your flashcard decks to see your progress and analytics here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
