/* ==========================================================================
   CyberSQL Master Drag Matrix — React Component v5 (100-Question Curriculum)
   10 Levels x 10 Progressive Missions per Level = 100 Questions Total
   ========================================================================== */

import React, { useState, useEffect, useMemo } from 'react';
import soundManager from './soundManager';
import './SQLCommandRoom.css';

// Fisher-Yates Shuffle Algorithm for Scrambling Widget Chips
const shuffleArray = (array) => {
  const arr = [...(array || [])];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// 100-Question Master SQL Curriculum Dataset
const SQL_LEVELS = [
  {
    id: 1,
    title: 'DQL Fundamentals & Filtering',
    topic: 'SELECT, WHERE, AND, OR, NOT & DISTINCT',
    missions: [
      {
        problem: 'Select all columns from cyber_units where status is ACTIVE.',
        correctSequence: ['SELECT *', 'FROM cyber_units', "WHERE status = 'ACTIVE'", ';'],
        widgetPool: ['FROM cyber_units', 'SELECT *', "WHERE status = 'ACTIVE'", "WHERE status = 'STANDBY'", ';']
      },
      {
        problem: 'Select name and power from cyber_units where power is strictly greater than 80.',
        correctSequence: ['SELECT', 'name, power', 'FROM cyber_units', 'WHERE power > 80', ';'],
        widgetPool: ['SELECT', 'name, power', 'WHERE power > 80', 'FROM cyber_units', 'WHERE power < 50', ';']
      },
      {
        problem: 'Select all units where status is ACTIVE AND power is greater than or equal to 85.',
        correctSequence: ['SELECT *', 'FROM cyber_units', "WHERE status = 'ACTIVE'", 'AND power >= 85', ';'],
        widgetPool: ["WHERE status = 'ACTIVE'", 'SELECT *', 'AND power >= 85', 'FROM cyber_units', 'AND power < 70', ';']
      },
      {
        problem: 'Select unit names where status is STANDBY OR power is less than 70.',
        correctSequence: ['SELECT', 'name', 'FROM cyber_units', "WHERE status = 'STANDBY'", 'OR power < 70', ';'],
        widgetPool: ['SELECT', 'name', 'FROM cyber_units', "WHERE status = 'STANDBY'", 'OR power < 70', 'AND power > 90', ';']
      },
      {
        problem: 'Select DISTINCT status values from the cyber_units table.',
        correctSequence: ['SELECT DISTINCT', 'status', 'FROM cyber_units', ';'],
        widgetPool: ['SELECT DISTINCT', 'status', 'FROM cyber_units', 'SELECT ALL', ';']
      },
      {
        problem: 'Select unit names where status is NOT OFFLINE.',
        correctSequence: ['SELECT', 'name', 'FROM cyber_units', "WHERE NOT status = 'OFFLINE'", ';'],
        widgetPool: ['WHERE NOT status = \'OFFLINE\'', 'SELECT', 'name', 'FROM cyber_units', "WHERE status = 'OFFLINE'", ';']
      },
      {
        problem: 'Select id and name from cyber_units where power is NOT equal to 0.',
        correctSequence: ['SELECT', 'id, name', 'FROM cyber_units', 'WHERE power != 0', ';'],
        widgetPool: ['SELECT', 'id, name', 'WHERE power != 0', 'FROM cyber_units', 'WHERE power = 0', ';']
      },
      {
        problem: 'Select unit names where status is ACTIVE AND (power > 80 OR id = 101).',
        correctSequence: ['SELECT', 'name', 'FROM cyber_units', "WHERE status = 'ACTIVE'", 'AND (power > 80 OR id = 101)', ';'],
        widgetPool: ['SELECT', 'name', 'FROM cyber_units', "WHERE status = 'ACTIVE'", 'AND (power > 80 OR id = 101)', ';']
      },
      {
        problem: 'Select all units where power is greater than or equal to 70 AND less than or equal to 95.',
        correctSequence: ['SELECT *', 'FROM cyber_units', 'WHERE power >= 70', 'AND power <= 95', ';'],
        widgetPool: ['SELECT *', 'FROM cyber_units', 'WHERE power >= 70', 'AND power <= 95', 'OR power > 100', ';']
      },
      {
        problem: 'Select name, power, and status from cyber_units where status is ACTIVE and power > 85.',
        correctSequence: ['SELECT', 'name, power, status', 'FROM cyber_units', "WHERE status = 'ACTIVE'", 'AND power > 85', ';'],
        widgetPool: ['SELECT', 'name, power, status', 'FROM cyber_units', "WHERE status = 'ACTIVE'", 'AND power > 85', 'WHERE power < 50', ';']
      }
    ],
    tables: [
      {
        name: 'cyber_units',
        columns: [
          { name: 'id', pk: true, type: 'INT' },
          { name: 'name', pk: false, type: 'VARCHAR(50)' },
          { name: 'power', pk: false, type: 'INT' },
          { name: 'status', pk: false, type: 'VARCHAR(20)' },
        ],
        rows: [
          { id: 101, name: 'Vanguard-Alpha', power: 92, status: 'ACTIVE' },
          { id: 102, name: 'Sentinel-Beta', power: 65, status: 'ACTIVE' },
          { id: 103, name: 'Quantum-Drone', power: 88, status: 'ACTIVE' },
          { id: 104, name: 'Cyber-Rover', power: 95, status: 'STANDBY' },
          { id: 105, name: 'Hyper-Titan', power: 84, status: 'ACTIVE' },
        ],
        matchedRowIds: [101, 103, 105],
      }
    ]
  },
  {
    id: 2,
    title: 'Pattern & Range Filtering',
    topic: 'LIKE, BETWEEN, IN & NOT IN',
    missions: [
      {
        problem: 'Select all units where name starts with "Vanguard".',
        correctSequence: ['SELECT *', 'FROM cyber_units', "WHERE name LIKE 'Vanguard%'", ';'],
        widgetPool: ['SELECT *', 'FROM cyber_units', "WHERE name LIKE 'Vanguard%'", "WHERE name = 'Vanguard'", ';']
      },
      {
        problem: 'Select all units where name ends with "Alpha".',
        correctSequence: ['SELECT *', 'FROM cyber_units', "WHERE name LIKE '%Alpha'", ';'],
        widgetPool: ["WHERE name LIKE '%Alpha'", 'SELECT *', 'FROM cyber_units', ';']
      },
      {
        problem: 'Select all units where name contains the word "Drone".',
        correctSequence: ['SELECT *', 'FROM cyber_units', "WHERE name LIKE '%Drone%'", ';'],
        widgetPool: ['SELECT *', 'FROM cyber_units', "WHERE name LIKE '%Drone%'", ';']
      },
      {
        problem: 'Select units where power rating is BETWEEN 80 AND 100.',
        correctSequence: ['SELECT *', 'FROM cyber_units', 'WHERE power BETWEEN 80 AND 100', ';'],
        widgetPool: ['SELECT *', 'FROM cyber_units', 'WHERE power BETWEEN 80 AND 100', 'WHERE power > 200', ';']
      },
      {
        problem: 'Select units where status is IN ("ACTIVE", "STANDBY").',
        correctSequence: ['SELECT *', 'FROM cyber_units', "WHERE status IN ('ACTIVE', 'STANDBY')", ';'],
        widgetPool: ["WHERE status IN ('ACTIVE', 'STANDBY')", 'SELECT *', 'FROM cyber_units', ';']
      },
      {
        problem: 'Select units where id is IN (101, 103, 105).',
        correctSequence: ['SELECT *', 'FROM cyber_units', 'WHERE id IN (101, 103, 105)', ';'],
        widgetPool: ['SELECT *', 'FROM cyber_units', 'WHERE id IN (101, 103, 105)', ';']
      },
      {
        problem: 'Select units where name does NOT start with "Cyber".',
        correctSequence: ['SELECT *', 'FROM cyber_units', "WHERE name NOT LIKE 'Cyber%'", ';'],
        widgetPool: ['SELECT *', 'FROM cyber_units', "WHERE name NOT LIKE 'Cyber%'", ';']
      },
      {
        problem: 'Select units where power is NOT BETWEEN 50 AND 75.',
        correctSequence: ['SELECT *', 'FROM cyber_units', 'WHERE power NOT BETWEEN 50 AND 75', ';'],
        widgetPool: ['WHERE power NOT BETWEEN 50 AND 75', 'SELECT *', 'FROM cyber_units', ';']
      },
      {
        problem: 'Select units where status is NOT IN ("OFFLINE").',
        correctSequence: ['SELECT *', 'FROM cyber_units', "WHERE status NOT IN ('OFFLINE')", ';'],
        widgetPool: ['SELECT *', 'FROM cyber_units', "WHERE status NOT IN ('OFFLINE')", ';']
      },
      {
        problem: 'Select units where name matches pattern with single character wildcard "_entinel%".',
        correctSequence: ['SELECT *', 'FROM cyber_units', "WHERE name LIKE '_entinel%'", ';'],
        widgetPool: ["WHERE name LIKE '_entinel%'", 'SELECT *', 'FROM cyber_units', ';']
      }
    ],
    tables: [
      {
        name: 'cyber_units',
        columns: [
          { name: 'id', pk: true, type: 'INT' },
          { name: 'name', pk: false, type: 'VARCHAR(50)' },
          { name: 'power', pk: false, type: 'INT' },
        ],
        rows: [
          { id: 101, name: 'Vanguard-Alpha', power: 92 },
          { id: 102, name: 'Sentinel-Beta', power: 65 },
          { id: 103, name: 'Quantum-Drone', power: 88 },
        ],
        matchedRowIds: [101, 103],
      }
    ]
  },
  {
    id: 3,
    title: 'Relational INNER JOINs',
    topic: 'INNER JOIN & Foreign Key Match',
    missions: [
      {
        problem: 'Join users (u) and orders (o) on u.id = o.user_id to select u.username and o.amount.',
        correctSequence: ['SELECT', 'u.username, o.amount', 'FROM users u', 'INNER JOIN orders o', 'ON u.id = o.user_id', ';'],
        widgetPool: ['INNER JOIN orders o', 'ON u.id = o.user_id', 'u.username, o.amount', 'FROM users u', 'SELECT', ';']
      },
      {
        problem: 'Join users (u) and orders (o) on matching user IDs where order amount is > 500.',
        correctSequence: ['SELECT', 'u.username, o.amount', 'FROM users u', 'INNER JOIN orders o', 'ON u.id = o.user_id', 'WHERE o.amount > 500', ';'],
        widgetPool: ['WHERE o.amount > 500', 'INNER JOIN orders o', 'ON u.id = o.user_id', 'FROM users u', 'SELECT', 'u.username, o.amount', ';']
      },
      {
        problem: 'Join users (u) and orders (o) where user role is ADMIN.',
        correctSequence: ['SELECT', 'u.username, o.amount', 'FROM users u', 'JOIN orders o', 'ON u.id = o.user_id', "WHERE u.role = 'ADMIN'", ';'],
        widgetPool: ["WHERE u.role = 'ADMIN'", 'JOIN orders o', 'ON u.id = o.user_id', 'FROM users u', 'SELECT', 'u.username, o.amount', ';']
      },
      {
        problem: 'Join users and orders filtering for order amounts BETWEEN 100 AND 2000.',
        correctSequence: ['SELECT', 'u.username, o.amount', 'FROM users u', 'INNER JOIN orders o', 'ON u.id = o.user_id', 'WHERE o.amount BETWEEN 100 AND 2000', ';'],
        widgetPool: ['WHERE o.amount BETWEEN 100 AND 2000', 'INNER JOIN orders o', 'ON u.id = o.user_id', 'FROM users u', 'SELECT', 'u.username, o.amount', ';']
      },
      {
        problem: 'Join users and orders filtering where username starts with "Alex".',
        correctSequence: ['SELECT', 'u.username, o.amount', 'FROM users u', 'INNER JOIN orders o', 'ON u.id = o.user_id', "WHERE u.username LIKE 'Alex%'", ';'],
        widgetPool: ["WHERE u.username LIKE 'Alex%'", 'INNER JOIN orders o', 'ON u.id = o.user_id', 'FROM users u', 'SELECT', 'u.username, o.amount', ';']
      },
      {
        problem: 'Join users and orders and sort output by order amount descending.',
        correctSequence: ['SELECT', 'u.username, o.amount', 'FROM users u', 'JOIN orders o', 'ON u.id = o.user_id', 'ORDER BY o.amount DESC', ';'],
        widgetPool: ['ORDER BY o.amount DESC', 'JOIN orders o', 'ON u.id = o.user_id', 'FROM users u', 'SELECT', 'u.username, o.amount', ';']
      },
      {
        problem: 'Join users and orders filtering for user_id = 1.',
        correctSequence: ['SELECT', 'u.username, o.amount', 'FROM users u', 'INNER JOIN orders o', 'ON u.id = o.user_id', 'WHERE o.user_id = 1', ';'],
        widgetPool: ['WHERE o.user_id = 1', 'INNER JOIN orders o', 'ON u.id = o.user_id', 'FROM users u', 'SELECT', 'u.username, o.amount', ';']
      },
      {
        problem: 'Join users and orders where amount > 1000 AND user role is ARCHITECT.',
        correctSequence: ['SELECT', 'u.username, o.amount', 'FROM users u', 'INNER JOIN orders o', 'ON u.id = o.user_id', "WHERE o.amount > 1000 AND u.role = 'ARCHITECT'", ';'],
        widgetPool: ["WHERE o.amount > 1000 AND u.role = 'ARCHITECT'", 'INNER JOIN orders o', 'ON u.id = o.user_id', 'FROM users u', 'SELECT', 'u.username, o.amount', ';']
      },
      {
        problem: 'Join users and orders where username is not equal to "Guest".',
        correctSequence: ['SELECT', 'u.username, o.amount', 'FROM users u', 'JOIN orders o', 'ON u.id = o.user_id', "WHERE u.username != 'Guest'", ';'],
        widgetPool: ["WHERE u.username != 'Guest'", 'JOIN orders o', 'ON u.id = o.user_id', 'FROM users u', 'SELECT', 'u.username, o.amount', ';']
      },
      {
        problem: 'Join users and orders where order amount is >= 3000.',
        correctSequence: ['SELECT', 'u.username, o.amount', 'FROM users u', 'INNER JOIN orders o', 'ON u.id = o.user_id', 'WHERE o.amount >= 3000', ';'],
        widgetPool: ['WHERE o.amount >= 3000', 'INNER JOIN orders o', 'ON u.id = o.user_id', 'FROM users u', 'SELECT', 'u.username, o.amount', ';']
      }
    ],
    tables: [
      {
        name: 'users (u)',
        columns: [
          { name: 'id', pk: true, type: 'INT' },
          { name: 'username', pk: false, type: 'VARCHAR(50)' },
          { name: 'role', pk: false, type: 'VARCHAR(20)' },
        ],
        rows: [
          { id: 1, username: 'Alex_Cyber', role: 'ADMIN' },
          { id: 2, username: 'Elena_Dev', role: 'ENGINEER' },
          { id: 3, username: 'Rohan_AI', role: 'ARCHITECT' },
        ],
        matchedRowIds: [1, 2, 3],
      },
      {
        name: 'orders (o)',
        columns: [
          { name: 'id', pk: true, type: 'INT' },
          { name: 'user_id', pk: false, type: 'INT (FK)' },
          { name: 'amount', pk: false, type: 'DECIMAL(10,2)' },
        ],
        rows: [
          { id: 501, user_id: 1, amount: '$1200.00' },
          { id: 502, user_id: 2, amount: '$450.50' },
          { id: 503, user_id: 3, amount: '$3200.00' },
        ],
        matchedRowIds: [501, 502, 503],
      }
    ]
  },
  {
    id: 4,
    title: 'Outer Joins & NULL Checks',
    topic: 'LEFT JOIN, RIGHT JOIN & IS NULL',
    missions: [
      {
        problem: 'Perform a LEFT JOIN between users (u) and orders (o) on u.id = o.user_id.',
        correctSequence: ['SELECT', 'u.username, o.amount', 'FROM users u', 'LEFT JOIN orders o', 'ON u.id = o.user_id', ';'],
        widgetPool: ['LEFT JOIN orders o', 'ON u.id = o.user_id', 'FROM users u', 'SELECT', 'u.username, o.amount', ';']
      },
      {
        problem: 'Select u.username from users u LEFT JOIN orders o on u.id = o.user_id WHERE o.id IS NULL.',
        correctSequence: ['SELECT', 'u.username', 'FROM users u', 'LEFT JOIN orders o', 'ON u.id = o.user_id', 'WHERE o.id IS NULL', ';'],
        widgetPool: ['WHERE o.id IS NULL', 'FROM users u', 'SELECT', 'u.username', 'LEFT JOIN orders o', 'ON u.id = o.user_id', ';']
      },
      {
        problem: 'Perform a RIGHT JOIN between users (u) and orders (o) on u.id = o.user_id.',
        correctSequence: ['SELECT', 'u.username, o.amount', 'FROM users u', 'RIGHT JOIN orders o', 'ON u.id = o.user_id', ';'],
        widgetPool: ['RIGHT JOIN orders o', 'ON u.id = o.user_id', 'FROM users u', 'SELECT', 'u.username, o.amount', ';']
      },
      {
        problem: 'Select usernames from users u LEFT JOIN orders o where order amount IS NOT NULL.',
        correctSequence: ['SELECT', 'u.username', 'FROM users u', 'LEFT JOIN orders o', 'ON u.id = o.user_id', 'WHERE o.amount IS NOT NULL', ';'],
        widgetPool: ['WHERE o.amount IS NOT NULL', 'LEFT JOIN orders o', 'ON u.id = o.user_id', 'FROM users u', 'SELECT', 'u.username', ';']
      },
      {
        problem: 'Perform a FULL OUTER JOIN between users (u) and orders (o).',
        correctSequence: ['SELECT', 'u.username, o.amount', 'FROM users u', 'FULL OUTER JOIN orders o', 'ON u.id = o.user_id', ';'],
        widgetPool: ['FULL OUTER JOIN orders o', 'ON u.id = o.user_id', 'FROM users u', 'SELECT', 'u.username, o.amount', ';']
      },
      {
        problem: 'Select u.username from users u LEFT JOIN orders o where o.user_id IS NULL.',
        correctSequence: ['SELECT', 'u.username', 'FROM users u', 'LEFT JOIN orders o', 'ON u.id = o.user_id', 'WHERE o.user_id IS NULL', ';'],
        widgetPool: ['WHERE o.user_id IS NULL', 'LEFT JOIN orders o', 'ON u.id = o.user_id', 'FROM users u', 'SELECT', 'u.username', ';']
      },
      {
        problem: 'Perform a LEFT JOIN where user role is ENGINEER.',
        correctSequence: ['SELECT', 'u.username, o.amount', 'FROM users u', 'LEFT JOIN orders o', 'ON u.id = o.user_id', "WHERE u.role = 'ENGINEER'", ';'],
        widgetPool: ["WHERE u.role = 'ENGINEER'", 'LEFT JOIN orders o', 'ON u.id = o.user_id', 'FROM users u', 'SELECT', 'u.username, o.amount', ';']
      },
      {
        problem: 'Perform a RIGHT JOIN and filter where user id IS NULL.',
        correctSequence: ['SELECT', 'u.username, o.amount', 'FROM users u', 'RIGHT JOIN orders o', 'ON u.id = o.user_id', 'WHERE u.id IS NULL', ';'],
        widgetPool: ['WHERE u.id IS NULL', 'RIGHT JOIN orders o', 'ON u.id = o.user_id', 'FROM users u', 'SELECT', 'u.username, o.amount', ';']
      },
      {
        problem: 'Perform a LEFT JOIN where order amount > 500 OR o.id IS NULL.',
        correctSequence: ['SELECT', 'u.username, o.amount', 'FROM users u', 'LEFT JOIN orders o', 'ON u.id = o.user_id', 'WHERE o.amount > 500 OR o.id IS NULL', ';'],
        widgetPool: ['WHERE o.amount > 500 OR o.id IS NULL', 'LEFT JOIN orders o', 'ON u.id = o.user_id', 'FROM users u', 'SELECT', 'u.username, o.amount', ';']
      },
      {
        problem: 'Perform a LEFT JOIN where username contains "Dev" AND o.id IS NULL.',
        correctSequence: ['SELECT', 'u.username', 'FROM users u', 'LEFT JOIN orders o', 'ON u.id = o.user_id', "WHERE u.username LIKE '%Dev%' AND o.id IS NULL", ';'],
        widgetPool: ["WHERE u.username LIKE '%Dev%' AND o.id IS NULL", 'LEFT JOIN orders o', 'ON u.id = o.user_id', 'FROM users u', 'SELECT', 'u.username', ';']
      }
    ],
    tables: [
      {
        name: 'users (u)',
        columns: [
          { name: 'id', pk: true, type: 'INT' },
          { name: 'username', pk: false, type: 'VARCHAR(50)' },
        ],
        rows: [
          { id: 1, username: 'Alex_Cyber' },
          { id: 2, username: 'Elena_Dev' },
          { id: 3, username: 'Guest_User' },
        ],
        matchedRowIds: [3],
      }
    ]
  },
  {
    id: 5,
    title: 'Aggregations & Grouping',
    topic: 'COUNT(), SUM(), AVG(), GROUP BY & HAVING',
    missions: [
      {
        problem: 'Count total records in department_sales table.',
        correctSequence: ['SELECT', 'COUNT(*)', 'FROM department_sales', ';'],
        widgetPool: ['SELECT', 'COUNT(*)', 'FROM department_sales', 'SELECT SUM(*)', ';']
      },
      {
        problem: 'Calculate total sum of sales from department_sales.',
        correctSequence: ['SELECT', 'SUM(sales)', 'FROM department_sales', ';'],
        widgetPool: ['SUM(sales)', 'SELECT', 'FROM department_sales', 'SELECT AVG(sales)', ';']
      },
      {
        problem: 'Calculate average sales from department_sales.',
        correctSequence: ['SELECT', 'AVG(sales)', 'FROM department_sales', ';'],
        widgetPool: ['SELECT', 'AVG(sales)', 'FROM department_sales', ';']
      },
      {
        problem: 'Select MAX(sales) and MIN(sales) from department_sales.',
        correctSequence: ['SELECT', 'MAX(sales), MIN(sales)', 'FROM department_sales', ';'],
        widgetPool: ['MAX(sales), MIN(sales)', 'SELECT', 'FROM department_sales', ';']
      },
      {
        problem: 'Select dept and SUM(sales) AS total_rev grouped by dept.',
        correctSequence: ['SELECT', 'dept, SUM(sales) AS total_rev', 'FROM department_sales', 'GROUP BY dept', ';'],
        widgetPool: ['GROUP BY dept', 'dept, SUM(sales) AS total_rev', 'FROM department_sales', 'SELECT', ';']
      },
      {
        problem: 'Count number of sales transactions per department.',
        correctSequence: ['SELECT', 'dept, COUNT(*) AS num_sales', 'FROM department_sales', 'GROUP BY dept', ';'],
        widgetPool: ['dept, COUNT(*) AS num_sales', 'FROM department_sales', 'GROUP BY dept', 'SELECT', ';']
      },
      {
        problem: 'Select dept and AVG(sales) grouped by dept HAVING AVG(sales) > 3000.',
        correctSequence: ['SELECT', 'dept, AVG(sales)', 'FROM department_sales', 'GROUP BY dept', 'HAVING AVG(sales) > 3000', ';'],
        widgetPool: ['HAVING AVG(sales) > 3000', 'dept, AVG(sales)', 'FROM department_sales', 'GROUP BY dept', 'SELECT', ';']
      },
      {
        problem: 'Select dept, SUM(sales) AS total_rev, group by dept, HAVING SUM(sales) > 5000.',
        correctSequence: ['SELECT', 'dept, SUM(sales) AS total_rev', 'FROM department_sales', 'GROUP BY dept', 'HAVING SUM(sales) > 5000', ';'],
        widgetPool: ['HAVING SUM(sales) > 5000', 'FROM department_sales', 'GROUP BY dept', 'SELECT', 'dept, SUM(sales) AS total_rev', ';']
      },
      {
        problem: 'Count transactions per department where individual sales > 2000.',
        correctSequence: ['SELECT', 'dept, COUNT(*)', 'FROM department_sales', 'WHERE sales > 2000', 'GROUP BY dept', ';'],
        widgetPool: ['WHERE sales > 2000', 'GROUP BY dept', 'dept, COUNT(*)', 'FROM department_sales', 'SELECT', ';']
      },
      {
        problem: 'Select dept and SUM(sales) grouped by dept HAVING COUNT(*) >= 2.',
        correctSequence: ['SELECT', 'dept, SUM(sales)', 'FROM department_sales', 'GROUP BY dept', 'HAVING COUNT(*) >= 2', ';'],
        widgetPool: ['HAVING COUNT(*) >= 2', 'dept, SUM(sales)', 'FROM department_sales', 'GROUP BY dept', 'SELECT', ';']
      }
    ],
    tables: [
      {
        name: 'department_sales',
        columns: [
          { name: 'id', pk: true, type: 'INT' },
          { name: 'dept', pk: false, type: 'VARCHAR(50)' },
          { name: 'sales', pk: false, type: 'INT' },
        ],
        rows: [
          { id: 1, dept: 'AI Lab', sales: 4500 },
          { id: 2, dept: 'AI Lab', sales: 3800 },
          { id: 3, dept: 'CyberSec', sales: 6200 },
          { id: 4, dept: 'DevOps', sales: 2100 },
          { id: 5, dept: 'CyberSec', sales: 4100 },
        ],
        matchedRowIds: [1, 2, 3, 5],
      }
    ]
  },
  {
    id: 6,
    title: 'Sorting & Pagination',
    topic: 'ORDER BY, DESC, ASC, LIMIT & OFFSET',
    missions: [
      {
        problem: 'Select name and salary from engineers sorted by salary DESC.',
        correctSequence: ['SELECT', 'name, salary', 'FROM engineers', 'ORDER BY salary DESC', ';'],
        widgetPool: ['ORDER BY salary DESC', 'name, salary', 'FROM engineers', 'SELECT', ';']
      },
      {
        problem: 'Select name and salary from engineers sorted by salary ASC.',
        correctSequence: ['SELECT', 'name, salary', 'FROM engineers', 'ORDER BY salary ASC', ';'],
        widgetPool: ['ORDER BY salary ASC', 'name, salary', 'FROM engineers', 'SELECT', ';']
      },
      {
        problem: 'Sort engineers by dept ASC and then salary DESC.',
        correctSequence: ['SELECT', 'name, dept, salary', 'FROM engineers', 'ORDER BY dept ASC, salary DESC', ';'],
        widgetPool: ['ORDER BY dept ASC, salary DESC', 'name, dept, salary', 'FROM engineers', 'SELECT', ';']
      },
      {
        problem: 'Select top 3 highest paid engineers using ORDER BY salary DESC LIMIT 3.',
        correctSequence: ['SELECT', 'name, salary', 'FROM engineers', 'ORDER BY salary DESC', 'LIMIT 3', ';'],
        widgetPool: ['LIMIT 3', 'ORDER BY salary DESC', 'FROM engineers', 'name, salary', 'SELECT', ';']
      },
      {
        problem: 'Select single highest paid engineer using LIMIT 1.',
        correctSequence: ['SELECT', 'name, salary', 'FROM engineers', 'ORDER BY salary DESC', 'LIMIT 1', ';'],
        widgetPool: ['LIMIT 1', 'ORDER BY salary DESC', 'FROM engineers', 'name, salary', 'SELECT', ';']
      },
      {
        problem: 'Select 2 engineers starting from 2nd highest salary using LIMIT 2 OFFSET 1.',
        correctSequence: ['SELECT', 'name, salary', 'FROM engineers', 'ORDER BY salary DESC', 'LIMIT 2 OFFSET 1', ';'],
        widgetPool: ['LIMIT 2 OFFSET 1', 'ORDER BY salary DESC', 'FROM engineers', 'name, salary', 'SELECT', ';']
      },
      {
        problem: 'Filter engineers with salary > 100000 and order by salary DESC.',
        correctSequence: ['SELECT', 'name, salary', 'FROM engineers', 'WHERE salary > 100000', 'ORDER BY salary DESC', ';'],
        widgetPool: ['ORDER BY salary DESC', 'WHERE salary > 100000', 'FROM engineers', 'name, salary', 'SELECT', ';']
      },
      {
        problem: 'Select first 5 engineer names ordered alphabetically by name ASC.',
        correctSequence: ['SELECT', 'name', 'FROM engineers', 'ORDER BY name ASC', 'LIMIT 5', ';'],
        widgetPool: ['LIMIT 5', 'ORDER BY name ASC', 'FROM engineers', 'SELECT', 'name', ';']
      },
      {
        problem: 'Select top 2 highest paid engineers in AI department.',
        correctSequence: ['SELECT', 'name, salary', 'FROM engineers', "WHERE dept = 'AI'", 'ORDER BY salary DESC', 'LIMIT 2', ';'],
        widgetPool: ['LIMIT 2', 'ORDER BY salary DESC', "WHERE dept = 'AI'", 'FROM engineers', 'SELECT', 'name, salary', ';']
      },
      {
        problem: 'Select 3 engineers starting from OFFSET 2 ordered by salary DESC.',
        correctSequence: ['SELECT', 'name, salary', 'FROM engineers', 'ORDER BY salary DESC', 'LIMIT 3 OFFSET 2', ';'],
        widgetPool: ['LIMIT 3 OFFSET 2', 'ORDER BY salary DESC', 'FROM engineers', 'SELECT', 'name, salary', ';']
      }
    ],
    tables: [
      {
        name: 'engineers',
        columns: [
          { name: 'id', pk: true, type: 'INT' },
          { name: 'name', pk: false, type: 'VARCHAR(50)' },
          { name: 'salary', pk: false, type: 'INT' },
        ],
        rows: [
          { id: 1, name: 'Vikram', salary: 160000 },
          { id: 2, name: 'Siddharth', salary: 150000 },
          { id: 3, name: 'Ananya', salary: 140000 },
          { id: 4, name: 'Neha', salary: 135000 },
        ],
        matchedRowIds: [1, 2, 3],
      }
    ]
  },
  {
    id: 7,
    title: 'Subqueries & Nested Queries',
    topic: 'IN (SELECT ...), EXISTS & Aggregated Subqueries',
    missions: [
      {
        problem: 'Select usernames from users where id is IN the set of user_ids from orders.',
        correctSequence: ['SELECT', 'username', 'FROM users', 'WHERE id IN (SELECT user_id FROM orders)', ';'],
        widgetPool: ['WHERE id IN (SELECT user_id FROM orders)', 'FROM users', 'SELECT', 'username', ';']
      },
      {
        problem: 'Select usernames from users where id is IN orders with amount > 1000.',
        correctSequence: ['SELECT', 'username', 'FROM users', 'WHERE id IN (SELECT user_id FROM orders WHERE amount > 1000)', ';'],
        widgetPool: ['WHERE id IN (SELECT user_id FROM orders WHERE amount > 1000)', 'FROM users', 'SELECT', 'username', ';']
      },
      {
        problem: 'Select usernames from users where id is NOT IN the user_ids from orders.',
        correctSequence: ['SELECT', 'username', 'FROM users', 'WHERE id NOT IN (SELECT user_id FROM orders)', ';'],
        widgetPool: ['WHERE id NOT IN (SELECT user_id FROM orders)', 'FROM users', 'SELECT', 'username', ';']
      },
      {
        problem: 'Select engineers whose salary is greater than the average salary of all engineers.',
        correctSequence: ['SELECT', 'name, salary', 'FROM engineers', 'WHERE salary > (SELECT AVG(salary) FROM engineers)', ';'],
        widgetPool: ['WHERE salary > (SELECT AVG(salary) FROM engineers)', 'FROM engineers', 'SELECT', 'name, salary', ';']
      },
      {
        problem: 'Select engineer with the single highest salary using subquery = (SELECT MAX(salary)...).',
        correctSequence: ['SELECT', 'name, salary', 'FROM engineers', 'WHERE salary = (SELECT MAX(salary) FROM engineers)', ';'],
        widgetPool: ['WHERE salary = (SELECT MAX(salary) FROM engineers)', 'FROM engineers', 'SELECT', 'name, salary', ';']
      },
      {
        problem: 'Select users where EXISTS an order in orders matching user_id.',
        correctSequence: ['SELECT', 'username', 'FROM users u', 'WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id)', ';'],
        widgetPool: ['WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id)', 'FROM users u', 'SELECT', 'username', ';']
      },
      {
        problem: 'Select users where NOT EXISTS any order in orders matching user_id.',
        correctSequence: ['SELECT', 'username', 'FROM users u', 'WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id)', ';'],
        widgetPool: ['WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id)', 'FROM users u', 'SELECT', 'username', ';']
      },
      {
        problem: 'Select engineers in departments with total revenue > 5000.',
        correctSequence: ['SELECT', 'name', 'FROM engineers', 'WHERE dept IN (SELECT dept FROM department_sales GROUP BY dept HAVING SUM(sales) > 5000)', ';'],
        widgetPool: ['WHERE dept IN (SELECT dept FROM department_sales GROUP BY dept HAVING SUM(sales) > 5000)', 'FROM engineers', 'SELECT', 'name', ';']
      },
      {
        problem: 'Select orders where amount is greater than the MIN order amount.',
        correctSequence: ['SELECT', 'amount', 'FROM orders', 'WHERE amount > (SELECT MIN(amount) FROM orders)', ';'],
        widgetPool: ['WHERE amount > (SELECT MIN(amount) FROM orders)', 'FROM orders', 'SELECT', 'amount', ';']
      },
      {
        problem: 'Select engineers with salary > ALL salaries in DevOps department.',
        correctSequence: ['SELECT', 'name, salary', 'FROM engineers', "WHERE salary > ALL (SELECT salary FROM engineers WHERE dept = 'DevOps')", ';'],
        widgetPool: ["WHERE salary > ALL (SELECT salary FROM engineers WHERE dept = 'DevOps')", 'FROM engineers', 'SELECT', 'name, salary', ';']
      }
    ],
    tables: [
      {
        name: 'users',
        columns: [
          { name: 'id', pk: true, type: 'INT' },
          { name: 'username', pk: false, type: 'VARCHAR(50)' },
        ],
        rows: [
          { id: 1, username: 'Alex_Cyber' },
          { id: 2, username: 'Elena_Dev' },
          { id: 3, username: 'Rohan_AI' },
        ],
        matchedRowIds: [1, 3],
      }
    ]
  },
  {
    id: 8,
    title: 'Window Functions & Partitions',
    topic: 'ROW_NUMBER(), RANK(), PARTITION BY, LAG() & LEAD()',
    missions: [
      {
        problem: 'Compute overall ROW_NUMBER() rank for engineers ordered by salary DESC.',
        correctSequence: ['SELECT', 'name, dept, salary,', 'ROW_NUMBER() OVER(ORDER BY salary DESC) as rank', 'FROM engineers', ';'],
        widgetPool: ['ROW_NUMBER() OVER(ORDER BY salary DESC) as rank', 'name, dept, salary,', 'FROM engineers', 'SELECT', ';']
      },
      {
        problem: 'Compute ROW_NUMBER() partitioned by dept and ordered by salary DESC.',
        correctSequence: ['SELECT', 'name, dept, salary,', 'ROW_NUMBER() OVER(PARTITION BY dept ORDER BY salary DESC) as rank', 'FROM engineers', ';'],
        widgetPool: ['ROW_NUMBER() OVER(PARTITION BY dept ORDER BY salary DESC) as rank', 'name, dept, salary,', 'FROM engineers', 'SELECT', ';']
      },
      {
        problem: 'Compute RANK() partitioned by dept and ordered by salary DESC.',
        correctSequence: ['SELECT', 'name, dept, salary,', 'RANK() OVER(PARTITION BY dept ORDER BY salary DESC) as rk', 'FROM engineers', ';'],
        widgetPool: ['RANK() OVER(PARTITION BY dept ORDER BY salary DESC) as rk', 'name, dept, salary,', 'FROM engineers', 'SELECT', ';']
      },
      {
        problem: 'Compute DENSE_RANK() partitioned by dept ordered by salary DESC.',
        correctSequence: ['SELECT', 'name, dept, salary,', 'DENSE_RANK() OVER(PARTITION BY dept ORDER BY salary DESC) as drk', 'FROM engineers', ';'],
        widgetPool: ['DENSE_RANK() OVER(PARTITION BY dept ORDER BY salary DESC) as drk', 'name, dept, salary,', 'FROM engineers', 'SELECT', ';']
      },
      {
        problem: 'Compute running total SUM(salary) OVER(PARTITION BY dept).',
        correctSequence: ['SELECT', 'name, dept, salary,', 'SUM(salary) OVER(PARTITION BY dept) as dept_total', 'FROM engineers', ';'],
        widgetPool: ['SUM(salary) OVER(PARTITION BY dept) as dept_total', 'name, dept, salary,', 'FROM engineers', 'SELECT', ';']
      },
      {
        problem: 'Compute average salary per department using AVG(salary) OVER(PARTITION BY dept).',
        correctSequence: ['SELECT', 'name, dept, salary,', 'AVG(salary) OVER(PARTITION BY dept) as dept_avg', 'FROM engineers', ';'],
        widgetPool: ['AVG(salary) OVER(PARTITION BY dept) as dept_avg', 'name, dept, salary,', 'FROM engineers', 'SELECT', ';']
      },
      {
        problem: 'Fetch previous row salary using LAG(salary, 1) OVER(ORDER BY salary DESC).',
        correctSequence: ['SELECT', 'name, dept, salary,', 'LAG(salary, 1) OVER(ORDER BY salary DESC) as prev_salary', 'FROM engineers', ';'],
        widgetPool: ['LAG(salary, 1) OVER(ORDER BY salary DESC) as prev_salary', 'name, dept, salary,', 'FROM engineers', 'SELECT', ';']
      },
      {
        problem: 'Fetch next row salary using LEAD(salary, 1) OVER(ORDER BY salary DESC).',
        correctSequence: ['SELECT', 'name, dept, salary,', 'LEAD(salary, 1) OVER(ORDER BY salary DESC) as next_salary', 'FROM engineers', ';'],
        widgetPool: ['LEAD(salary, 1) OVER(ORDER BY salary DESC) as next_salary', 'name, dept, salary,', 'FROM engineers', 'SELECT', ';']
      },
      {
        problem: 'Fetch top earner name per department using FIRST_VALUE(name) OVER(PARTITION BY dept...).',
        correctSequence: ['SELECT', 'name, dept, salary,', 'FIRST_VALUE(name) OVER(PARTITION BY dept ORDER BY salary DESC) as top_earner', 'FROM engineers', ';'],
        widgetPool: ['FIRST_VALUE(name) OVER(PARTITION BY dept ORDER BY salary DESC) as top_earner', 'name, dept, salary,', 'FROM engineers', 'SELECT', ';']
      },
      {
        problem: 'Divide engineers into 2 salary quartiles using NTILE(2) OVER(ORDER BY salary DESC).',
        correctSequence: ['SELECT', 'name, dept, salary,', 'NTILE(2) OVER(ORDER BY salary DESC) as salary_quartile', 'FROM engineers', ';'],
        widgetPool: ['NTILE(2) OVER(ORDER BY salary DESC) as salary_quartile', 'name, dept, salary,', 'FROM engineers', 'SELECT', ';']
      }
    ],
    tables: [
      {
        name: 'engineers',
        columns: [
          { name: 'id', pk: true, type: 'INT' },
          { name: 'name', pk: false, type: 'VARCHAR(50)' },
          { name: 'dept', pk: false, type: 'VARCHAR(30)' },
          { name: 'salary', pk: false, type: 'INT' },
        ],
        rows: [
          { id: 1, name: 'Siddharth', dept: 'AI', salary: 150000 },
          { id: 2, name: 'Neha', dept: 'AI', salary: 135000 },
          { id: 3, name: 'Vikram', dept: 'Cloud', salary: 160000 },
          { id: 4, name: 'Ananya', dept: 'Cloud', salary: 140000 },
        ],
        matchedRowIds: [1, 2, 3, 4],
      }
    ]
  },
  {
    id: 9,
    title: 'Data Modification DML',
    topic: 'INSERT INTO, UPDATE SET & DELETE FROM',
    missions: [
      {
        problem: 'Insert new unit (106, "Hyper-Rogue", 89, "ACTIVE") into cyber_units table.',
        correctSequence: ['INSERT INTO cyber_units (id, name, power, status)', 'VALUES (106, \'Hyper-Rogue\', 89, \'ACTIVE\')', ';'],
        widgetPool: ['VALUES (106, \'Hyper-Rogue\', 89, \'ACTIVE\')', 'INSERT INTO cyber_units (id, name, power, status)', ';']
      },
      {
        problem: 'Update status of unit 104 to ACTIVE.',
        correctSequence: ['UPDATE cyber_units', "SET status = 'ACTIVE'", 'WHERE id = 104', ';'],
        widgetPool: ["SET status = 'ACTIVE'", 'WHERE id = 104', 'UPDATE cyber_units', ';']
      },
      {
        problem: 'Increment power by 10 for all ACTIVE units.',
        correctSequence: ['UPDATE cyber_units', 'SET power = power + 10', "WHERE status = 'ACTIVE'", ';'],
        widgetPool: ["WHERE status = 'ACTIVE'", 'SET power = power + 10', 'UPDATE cyber_units', ';']
      },
      {
        problem: 'Update unit 104 setting status to ACTIVE and power to 100.',
        correctSequence: ['UPDATE cyber_units', "SET status = 'ACTIVE', power = 100", 'WHERE id = 104', ';'],
        widgetPool: ["SET status = 'ACTIVE', power = 100", 'WHERE id = 104', 'UPDATE cyber_units', ';']
      },
      {
        problem: 'Delete all units from cyber_units where status is OFFLINE.',
        correctSequence: ['DELETE FROM cyber_units', "WHERE status = 'OFFLINE'", ';'],
        widgetPool: ["WHERE status = 'OFFLINE'", 'DELETE FROM cyber_units', ';']
      },
      {
        problem: 'Delete units from cyber_units where power rating is less than 50.',
        correctSequence: ['DELETE FROM cyber_units', 'WHERE power < 50', ';'],
        widgetPool: ['WHERE power < 50', 'DELETE FROM cyber_units', ';']
      },
      {
        problem: 'Increase salary by 10% for engineers in AI department.',
        correctSequence: ['UPDATE engineers', 'SET salary = salary * 1.10', "WHERE dept = 'AI'", ';'],
        widgetPool: ["WHERE dept = 'AI'", 'SET salary = salary * 1.10', 'UPDATE engineers', ';']
      },
      {
        problem: 'Insert new user (4, "Maya_Dev", "ENGINEER") into users table.',
        correctSequence: ['INSERT INTO users (id, username, role)', 'VALUES (4, \'Maya_Dev\', \'ENGINEER\')', ';'],
        widgetPool: ['VALUES (4, \'Maya_Dev\', \'ENGINEER\')', 'INSERT INTO users (id, username, role)', ';']
      },
      {
        problem: 'Add 1000 to bank_accounts balance for account_id 101.',
        correctSequence: ['UPDATE bank_accounts', 'SET balance = balance + 1000', 'WHERE account_id = 101', ';'],
        widgetPool: ['WHERE account_id = 101', 'SET balance = balance + 1000', 'UPDATE bank_accounts', ';']
      },
      {
        problem: 'Delete orders from orders table where amount is less than 100.',
        correctSequence: ['DELETE FROM orders', 'WHERE amount < 100', ';'],
        widgetPool: ['WHERE amount < 100', 'DELETE FROM orders', ';']
      }
    ],
    tables: [
      {
        name: 'cyber_units',
        columns: [
          { name: 'id', pk: true, type: 'INT' },
          { name: 'status', pk: false, type: 'VARCHAR(20)' },
          { name: 'power', pk: false, type: 'INT' },
        ],
        rows: [
          { id: 104, status: 'ACTIVE', power: 100 },
        ],
        matchedRowIds: [104],
      }
    ]
  },
  {
    id: 10,
    title: 'ACID Transactions & Schema DDL',
    topic: 'CREATE TABLE, BEGIN TRANSACTION, COMMIT & ROLLBACK',
    missions: [
      {
        problem: 'Create table cyber_logs with log_id INT PRIMARY KEY and message VARCHAR(255).',
        correctSequence: ['CREATE TABLE cyber_logs', '(log_id INT PRIMARY KEY, message VARCHAR(255))', ';'],
        widgetPool: ['(log_id INT PRIMARY KEY, message VARCHAR(255))', 'CREATE TABLE cyber_logs', ';']
      },
      {
        problem: 'Alter table cyber_units to add column last_active TIMESTAMP.',
        correctSequence: ['ALTER TABLE cyber_units', 'ADD COLUMN last_active TIMESTAMP', ';'],
        widgetPool: ['ADD COLUMN last_active TIMESTAMP', 'ALTER TABLE cyber_units', ';']
      },
      {
        problem: 'Drop table temp_logs if it exists.',
        correctSequence: ['DROP TABLE IF EXISTS', 'temp_logs', ';'],
        widgetPool: ['temp_logs', 'DROP TABLE IF EXISTS', ';']
      },
      {
        problem: 'Execute transaction: BEGIN TRANSACTION; UPDATE bank_accounts SET balance = balance - 500 WHERE account_id = 101; COMMIT;',
        correctSequence: ['BEGIN TRANSACTION;', 'UPDATE bank_accounts', 'SET balance = balance - 500', 'WHERE account_id = 101;', 'COMMIT;'],
        widgetPool: ['COMMIT;', 'UPDATE bank_accounts', 'WHERE account_id = 101;', 'BEGIN TRANSACTION;', 'SET balance = balance - 500', ';']
      },
      {
        problem: 'Execute transaction: BEGIN TRANSACTION; UPDATE bank_accounts SET balance = balance - 500 WHERE account_id = 101; ROLLBACK;',
        correctSequence: ['BEGIN TRANSACTION;', 'UPDATE bank_accounts', 'SET balance = balance - 500', 'WHERE account_id = 101;', 'ROLLBACK;'],
        widgetPool: ['ROLLBACK;', 'UPDATE bank_accounts', 'WHERE account_id = 101;', 'BEGIN TRANSACTION;', 'SET balance = balance - 500', ';']
      },
      {
        problem: 'Create unique index idx_user_name on users(username).',
        correctSequence: ['CREATE UNIQUE INDEX idx_user_name', 'ON users(username)', ';'],
        widgetPool: ['ON users(username)', 'CREATE UNIQUE INDEX idx_user_name', ';']
      },
      {
        problem: 'Execute safety rollback on deleting order 501.',
        correctSequence: ['BEGIN TRANSACTION;', 'DELETE FROM orders', 'WHERE id = 501;', 'ROLLBACK;'],
        widgetPool: ['ROLLBACK;', 'DELETE FROM orders', 'WHERE id = 501;', 'BEGIN TRANSACTION;', ';']
      },
      {
        problem: 'Create table audit_trail with id INT PRIMARY KEY and action VARCHAR(50).',
        correctSequence: ['CREATE TABLE audit_trail', '(id INT PRIMARY KEY, action VARCHAR(50))', ';'],
        widgetPool: ['(id INT PRIMARY KEY, action VARCHAR(50))', 'CREATE TABLE audit_trail', ';']
      },
      {
        problem: 'Execute commit transaction inserting into cyber_logs.',
        correctSequence: ['BEGIN TRANSACTION;', 'INSERT INTO cyber_logs', "VALUES (1, 'System Purge');", 'COMMIT;'],
        widgetPool: ['COMMIT;', "VALUES (1, 'System Purge');", 'INSERT INTO cyber_logs', 'BEGIN TRANSACTION;', ';']
      },
      {
        problem: 'Execute commit transaction adding 5000 balance to account 102.',
        correctSequence: ['BEGIN TRANSACTION;', 'UPDATE bank_accounts', 'SET balance = balance + 5000', 'WHERE account_id = 102;', 'COMMIT;'],
        widgetPool: ['COMMIT;', 'WHERE account_id = 102;', 'SET balance = balance + 5000', 'UPDATE bank_accounts', 'BEGIN TRANSACTION;', ';']
      }
    ],
    tables: [
      {
        name: 'bank_accounts',
        columns: [
          { name: 'account_id', pk: true, type: 'INT' },
          { name: 'holder', pk: false, type: 'VARCHAR(50)' },
          { name: 'balance', pk: false, type: 'DECIMAL(12,2)' },
        ],
        rows: [
          { account_id: 101, holder: 'Main Vault', balance: '$49,500.00' },
          { account_id: 102, holder: 'Reserve Vault', balance: '$120,000.00' },
        ],
        matchedRowIds: [101],
      }
    ]
  }
];

export default function SQLCommandRoom({ onBack }) {
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [currentMissionIdx, setCurrentMissionIdx] = useState(0);
  const [placedWidgets, setPlacedWidgets] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [executingLogs, setExecutingLogs] = useState([]);
  const [showVictory, setShowVictory] = useState(false);
  const [isQueryExecuted, setIsQueryExecuted] = useState(false);

  // Track Completed & Max Unlocked Levels persistently in localStorage
  const getInitialCompletedLevels = () => {
    try {
      const raw = localStorage.getItem('sql_completed_levels');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  };

  const [completedLevelIds, setCompletedLevelIds] = useState(getInitialCompletedLevels);

  const getInitialMaxUnlocked = () => {
    try {
      const raw = parseInt(localStorage.getItem('sql_max_unlocked_level') || '1', 10);
      const computedFromCompleted = getInitialCompletedLevels().length > 0
        ? Math.max(...getInitialCompletedLevels()) + 1
        : 1;
      return Math.max(1, isNaN(raw) ? 1 : raw, computedFromCompleted);
    } catch (e) {
      return 1;
    }
  };

  const [maxUnlockedLevelId, setMaxUnlockedLevelId] = useState(getInitialMaxUnlocked);

  const isLevelUnlocked = (lvlId) => {
    return lvlId === 1 || completedLevelIds.includes(lvlId) || lvlId <= maxUnlockedLevelId;
  };

  const level = SQL_LEVELS.find((l) => l.id === currentLevelId) || SQL_LEVELS[0];
  const missions = level?.missions || [];
  const currentMission = missions[currentMissionIdx] || missions[0];

  // Scramble Widget Pool Chips on level/mission change
  const shuffledWidgetPool = useMemo(() => {
    return shuffleArray(currentMission?.widgetPool || []);
  }, [currentLevelId, currentMissionIdx, currentMission]);

  useEffect(() => {
    try { soundManager.init(); soundManager.resume(); } catch (e) {}
    setPlacedWidgets([]);
    setExecutingLogs([`>>> SQL Mission ${currentMissionIdx + 1}/10 Ready. Click/drag widgets into the pipeline sequence!`]);
    setShowVictory(false);
    setIsQueryExecuted(false);
    setIsRunning(false);
  }, [currentLevelId, currentMissionIdx]);

  // Handle Switch Level
  const handleSelectLevel = (lvlId) => {
    if (!isLevelUnlocked(lvlId)) {
      try { soundManager.playWrong(); } catch (e) {}
      setExecutingLogs([`🔒 LEVEL ${lvlId} IS LOCKED! Complete Level ${lvlId - 1} first to unlock.`]);
      return;
    }
    try { soundManager.playClick(); } catch (e) {}
    setCurrentLevelId(lvlId);
    setCurrentMissionIdx(0);
  };

  // Click Widget in Pool to Add to Pipeline
  const handleAddWidget = (widget) => {
    try { soundManager.playClick(); } catch (e) {}
    setPlacedWidgets((prev) => [...prev, widget]);
  };

  // Click Placed Widget to Remove from Pipeline
  const handleRemoveWidget = (index) => {
    try { soundManager.playClick(); } catch (e) {}
    setPlacedWidgets((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Auto Connect Exact Sequence
  const handleAutoConnect = () => {
    try { soundManager.playCollect(); } catch (e) {}
    setPlacedWidgets(currentMission?.correctSequence || []);
  };

  // Reset Pipeline
  const handleResetPipeline = () => {
    try { soundManager.playClick(); } catch (e) {}
    setPlacedWidgets([]);
    setIsQueryExecuted(false);
  };

  // Verify Pipeline Sequence
  const handleVerifySequence = () => {
    if (isRunning) return;

    try {
      try { soundManager.init(); soundManager.resume(); } catch (e) {}

      const userSequenceStr = (placedWidgets || []).join(' ').replace(/\s+/g, ' ').trim().toLowerCase();
      const targetSequenceStr = (currentMission?.correctSequence || []).join(' ').replace(/\s+/g, ' ').trim().toLowerCase();

      const isCorrect = userSequenceStr.length > 0 && userSequenceStr === targetSequenceStr;

      setIsRunning(true);
      try { soundManager.playNitro(); } catch (e) {}
      setExecutingLogs([`>>> 🗄️ VALIDATING MISSION ${currentMissionIdx + 1}/10 PIPELINE SEQUENCE...`]);

      let logIdx = 0;
      const logsList = ['>>> Compiling AST for sequence...', '>>> Checking syntax tree & column clauses...', '>>> SUCCESS: Mission pipeline sequence validated!'];

      const interval = setInterval(() => {
        try {
          if (logIdx < logsList.length) {
            const currentLog = logsList[logIdx];
            setExecutingLogs((prev) => [...prev, currentLog]);
            logIdx++;
          } else {
            clearInterval(interval);
            setIsRunning(false);

            if (isCorrect) {
              setIsQueryExecuted(true);
              try { soundManager.playLevelComplete(); } catch (e) {}

              // Advance to next mission or complete level
              if (currentMissionIdx < missions.length - 1) {
                setTimeout(() => {
                  setCurrentMissionIdx((prev) => prev + 1);
                }, 800);
              } else {
                // All 10 missions finished for this level!
                if (!completedLevelIds.includes(currentLevelId)) {
                  const nextCompleted = [...completedLevelIds, currentLevelId];
                  setCompletedLevelIds(nextCompleted);
                  try { localStorage.setItem('sql_completed_levels', JSON.stringify(nextCompleted)); } catch (e) {}
                }

                // Unlock next level
                const nextUnlocked = Math.max(maxUnlockedLevelId, currentLevelId + 1);
                setMaxUnlockedLevelId(nextUnlocked);
                try { localStorage.setItem('sql_max_unlocked_level', nextUnlocked.toString()); } catch (e) {}

                setShowVictory(true);
              }
            } else {
              try { soundManager.playWrong(); } catch (e) {}
              setExecutingLogs((prev) => [
                ...prev,
                '⚠️ SEQUENCE MISMATCH: Incorrect widget order or distractor widget included! Check the problem objective.',
              ]);
            }
          }
        } catch (err) {
          clearInterval(interval);
          setIsRunning(false);
          setExecutingLogs((prev) => [...prev, `⚠️ ERROR: ${err?.message || 'Execution error'}`]);
        }
      }, 350);
    } catch (err) {
      setIsRunning(false);
      setExecutingLogs((prev) => [...prev, `⚠️ FATAL ERROR: ${err?.message || 'Fatal error'}`]);
    }
  };

  return (
    <div className="sql-room-container">
      {/* ── Top Header ── */}
      <div className="sql-header">
        <div className="sql-title-group">
          <div className="sql-subtitle" style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 800 }}>
            Level {level?.id || 1} of 10: {level?.title || ''} — Mission {currentMissionIdx + 1} / 10
          </div>
        </div>

        <div className="sql-header-controls">
          <button className="sql-btn-back" onClick={onBack}>
            ← Back to Picker
          </button>

          <button className="sql-btn-back" onClick={handleAutoConnect} style={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)' }}>
            ⚡ AUTO-CONNECT SEQUENCE
          </button>

          <button className="sql-btn-run" onClick={handleVerifySequence} disabled={isRunning}>
            {isRunning ? '⏳ CHECKING...' : '▶ CHECK QUERY SEQUENCE'}
          </button>
        </div>
      </div>

      {/* ── Workspace ── */}
      <div className="sql-workspace">
        {/* Left Sidebar */}
        <div className="sql-sidebar">
          <div className="sql-section-title">MISSION OBJECTIVE ({currentMissionIdx + 1} / 10)</div>
          <div className="sql-problem-card" style={{ marginBottom: 12 }}>
            📋 {currentMission?.problem || ''}
          </div>

          <div className="sql-section-title">DATABASE MISSIONS (10 LEVELS)</div>
          <div className="sql-level-pills">
            {(SQL_LEVELS || []).map((lvl) => {
              const isCompleted = completedLevelIds.includes(lvl.id);
              const isActive = currentLevelId === lvl.id;
              const unlocked = isLevelUnlocked(lvl.id);

              return (
                <div
                  key={lvl.id}
                  className={`sql-level-pill ${isActive ? 'active' : isCompleted ? 'completed' : !unlocked ? 'locked' : ''}`}
                  onClick={() => handleSelectLevel(lvl.id)}
                  style={{ opacity: !unlocked ? 0.45 : 1 }}
                >
                  <span>L{lvl.id}: {lvl.title}</span>
                  <span>{isActive ? '⚡' : isCompleted ? '✅' : !unlocked ? '🔒' : '🔓'}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Pipeline & Table Area */}
        <div className="sql-center-area">
          {/* Prominent Center Mission Objective Banner */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#f8fafc',
              fontSize: '0.92rem',
              fontWeight: 700,
              boxShadow: '0 4px 20px rgba(245, 158, 11, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div>
              <span style={{ color: '#f59e0b', fontSize: '0.8rem', fontFamily: '"Fira Code", monospace', display: 'block', marginBottom: 2 }}>
                🎯 MISSION {currentMissionIdx + 1} OF 10 TASK:
              </span>
              <span>📋 {currentMission?.problem || ''}</span>
            </div>
            <div style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', fontFamily: '"Fira Code", monospace', fontSize: '0.75rem' }}>
              {currentMissionIdx + 1}/10
            </div>
          </div>

          {/* Sequenced Pipeline Drop Zone */}
          <div className="sql-pipeline-container">
            <div className="sql-pipeline-header">
              <span>🔗 MISSION {currentMissionIdx + 1}/10 QUERY PIPELINE SEQUENCE:</span>
              <button
                onClick={handleResetPipeline}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.75rem' }}
              >
                Clear Sequence ✕
              </button>
            </div>

            <div className="sql-pipeline-slots">
              {placedWidgets.length === 0 ? (
                <div className="sql-empty-slot">
                  👇 Click or drag SQL widget blocks below to connect them into sequence...
                </div>
              ) : (
                placedWidgets.map((widget, idx) => (
                  <React.Fragment key={idx}>
                    <div className="sql-slot-box" onClick={() => handleRemoveWidget(idx)}>
                      <span>{widget}</span>
                      <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>✕</span>
                    </div>
                    {idx < placedWidgets.length - 1 && <span className="sql-connector-arrow">➔</span>}
                  </React.Fragment>
                ))
              )}
            </div>
          </div>

          {/* Scrambled Widget Pool Chips */}
          <div className="sql-widgets-pool">
            <div className="sql-section-title" style={{ margin: 0 }}>
              AVAILABLE SQL WIDGET CHIPS (SCRAMBLED - CLICK TO CONNECT):
            </div>
            <div className="sql-widgets-grid">
              {shuffledWidgetPool.map((widget, idx) => {
                const isUsed = placedWidgets.includes(widget);
                return (
                  <div
                    key={idx}
                    className={`sql-widget-chip ${isUsed ? 'used' : ''}`}
                    onClick={() => !isUsed && handleAddWidget(widget)}
                  >
                    {widget}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Database Table Grid Card */}
          {(level?.tables || []).map((tbl, tIdx) => (
            <div key={tIdx} className="sql-table-card">
              <div className="sql-table-header">
                <div className="sql-table-name">
                  <span>📊</span> TABLE: {tbl.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: '"Fira Code", monospace' }}>
                  {tbl.rows.length} records
                </div>
              </div>

              <table className="sql-grid">
                <thead>
                  <tr>
                    {(tbl.columns || []).map((col, cIdx) => (
                      <th key={cIdx}>
                        {col.name} {col.pk && <span className="sql-pk-badge">PK 🔑</span>}
                        <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 400 }}>{col.type}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(tbl.rows || []).map((row, rIdx) => {
                    const rowKeyId = row?.id ?? row?.account_id ?? rIdx;
                    const matchedList = Array.isArray(tbl.matchedRowIds) ? tbl.matchedRowIds : [];
                    const isMatched = Boolean(isQueryExecuted && matchedList.includes(rowKeyId));
                    const isUnmatched = Boolean(isQueryExecuted && !isMatched);

                    return (
                      <tr key={rIdx} className={isMatched ? 'matched' : isUnmatched ? 'unmatched' : ''}>
                        {(tbl.columns || []).map((col, cIdx) => (
                          <td key={cIdx}>{row[col.name]}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>

      {/* ── Console Logs Window ── */}
      <div className="sql-query-editor">
        <div className="sql-logs-container">
          {executingLogs.map((log, idx) => (
            <div key={idx} className={`sql-log-line ${log?.includes('SUCCESS') ? 'sql-log-success' : ''}`}>
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* ── Victory Celebration Modal ── */}
      {showVictory && (
        <div className="sql-modal-overlay">
          <div className="sql-modal-card">
            <div style={{ fontSize: '3.5rem' }}>🎉 🗄️⚡</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10b981', margin: 0 }}>
              LEVEL {level?.id || 1} ALL 10 MISSIONS COMPLETED!
            </h2>
            <div style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
              You successfully conquered all 10 SQL missions for <strong>{level?.topic || ''}</strong>!
            </div>
            <div style={{ display: 'flex', gap: 6, fontSize: '1.5rem', margin: '8px 0' }}>
              ⭐ ⭐ ⭐ ⭐ ⭐
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                className="sql-btn-run"
                onClick={() => {
                  if (currentLevelId < SQL_LEVELS.length) {
                    setCurrentLevelId((prev) => prev + 1);
                    setCurrentMissionIdx(0);
                  } else {
                    onBack();
                  }
                }}
              >
                {currentLevelId < SQL_LEVELS.length ? 'NEXT SQL LEVEL ➔' : 'BACK TO MENU'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
