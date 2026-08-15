/* ==========================================================================
   LangChain & LangGraph Master Command Room — React Component v4
   Unified IDE Code Canvas (app.py) + init_chat_model() + 12-Lesson Syllabus
   ========================================================================== */

import React, { useState, useEffect, useMemo } from 'react';
import soundManager from './soundManager';
import './LangChainCommandRoom.css';

// Fisher-Yates Shuffle Algorithm for Scrambling Chips
const shuffleArray = (array) => {
  const arr = [...(array || [])];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const LANGCHAIN_SYLLABUS = [
  {
    id: 1,
    title: 'Setup + Pehla Model Call',
    topic: 'init_chat_model & basic invoke()',
    missions: [
      {
        problem: 'Install python-dotenv & langchain-openai, load environment variables using load_dotenv(), initialize model using init_chat_model("gpt-4o"), and invoke prompt.',
        correctSequence: [
          '!pip install python-dotenv langchain-openai',
          'import os',
          'from dotenv import load_dotenv',
          'load_dotenv()',
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o", model_provider="openai")',
          'response = model.invoke("Hello LangChain!")',
          'print(response.content)'
        ],
        availablePool: [
          '!pip install python-dotenv langchain-openai',
          'import os',
          'from dotenv import load_dotenv',
          'load_dotenv()',
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o", model_provider="openai")',
          'response = model.invoke("Hello LangChain!")',
          'print(response.content)',
          'from dotenv import dotenv_values',
          '!pip install numpy pandas',
          'from langchain_community.llms import OpenAI'
        ]
      },
      {
        problem: 'Initialize Claude model using init_chat_model("claude-3-5-sonnet") with temperature=0.7.',
        correctSequence: [
          '!pip install langchain langchain-anthropic',
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("claude-3-5-sonnet", model_provider="anthropic", temperature=0.7)',
          'res = model.invoke("Generate AI system description")',
          'print(res.content)'
        ],
        availablePool: [
          '!pip install langchain langchain-anthropic',
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("claude-3-5-sonnet", model_provider="anthropic", temperature=0.7)',
          'res = model.invoke("Generate AI system description")',
          'print(res.content)',
          'model.invoke("test")'
        ]
      },
      {
        problem: 'Initialize Gemini model using init_chat_model("gemini-1.5-pro") and stream response.',
        correctSequence: [
          '!pip install langchain langchain-google-genai',
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gemini-1.5-pro", model_provider="google_genai")',
          'for chunk in model.stream("Stream AI response"):',
          '    print(chunk.content, end="")'
        ],
        availablePool: [
          '!pip install langchain langchain-google-genai',
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gemini-1.5-pro", model_provider="google_genai")',
          'for chunk in model.stream("Stream AI response"):',
          '    print(chunk.content, end="")'
        ]
      },
      {
        problem: 'Load API keys from .env file using python-dotenv load_dotenv() and call init_chat_model().',
        correctSequence: [
          '!pip install python-dotenv langchain',
          'import os',
          'from dotenv import load_dotenv',
          'load_dotenv()',
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'print(model.invoke("Verify Dotenv API Key").content)'
        ],
        availablePool: [
          '!pip install python-dotenv langchain',
          'import os',
          'from dotenv import load_dotenv',
          'load_dotenv()',
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'print(model.invoke("Verify Dotenv API Key").content)',
          'from dotenv import dotenv_values',
          'os.getenv("OPENAI_API_KEY")'
        ]
      },
      {
        problem: 'Batch multiple prompts using model.batch().',
        correctSequence: [
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'results = model.batch(["Hi", "Explain AI"])',
          'for r in results: print(r.content)'
        ],
        availablePool: [
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'results = model.batch(["Hi", "Explain AI"])',
          'for r in results: print(r.content)'
        ]
      },
      {
        problem: 'Pass SystemMessage and HumanMessage to init_chat_model() instance.',
        correctSequence: [
          'from langchain_core.messages import SystemMessage, HumanMessage',
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'messages = [SystemMessage("Act as AI mentor"), HumanMessage("Hello")]',
          'print(model.invoke(messages).content)'
        ],
        availablePool: [
          'from langchain_core.messages import SystemMessage, HumanMessage',
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'messages = [SystemMessage("Act as AI mentor"), HumanMessage("Hello")]',
          'print(model.invoke(messages).content)'
        ]
      },
      {
        problem: 'Parse output string directly using StrOutputParser.',
        correctSequence: [
          'from langchain_core.output_parsers import StrOutputParser',
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'parser = StrOutputParser()',
          'text = parser.invoke(model.invoke("Hello"))',
          'print(text)'
        ],
        availablePool: [
          'from langchain_core.output_parsers import StrOutputParser',
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'parser = StrOutputParser()',
          'text = parser.invoke(model.invoke("Hello"))',
          'print(text)'
        ]
      },
      {
        problem: 'Configure configurable_fields in init_chat_model for dynamic provider switching.',
        correctSequence: [
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model(configurable_fields=("model", "model_provider"))',
          'res = model.invoke("Test", config={"configurable": {"model": "gpt-4o", "model_provider": "openai"}})',
          'print(res.content)'
        ],
        availablePool: [
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model(configurable_fields=("model", "model_provider"))',
          'res = model.invoke("Test", config={"configurable": {"model": "gpt-4o", "model_provider": "openai"}})',
          'print(res.content)'
        ]
      },
      {
        problem: 'Use max_tokens=256 and temperature=0.2 in init_chat_model().',
        correctSequence: [
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o", temperature=0.2, max_tokens=256)',
          'print(model.invoke("Write code").content)'
        ],
        availablePool: [
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o", temperature=0.2, max_tokens=256)',
          'print(model.invoke("Write code").content)'
        ]
      },
      {
        problem: 'Assemble complete model call script with init_chat_model and StrOutputParser.',
        correctSequence: [
          '!pip install langchain langchain-openai',
          'from langchain.chat_models import init_chat_model',
          'from langchain_core.output_parsers import StrOutputParser',
          'model = init_chat_model("gpt-4o", model_provider="openai")',
          'out = (model | StrOutputParser()).invoke("Pipeline test")',
          'print(out)'
        ],
        availablePool: [
          '!pip install langchain langchain-openai',
          'from langchain.chat_models import init_chat_model',
          'from langchain_core.output_parsers import StrOutputParser',
          'model = init_chat_model("gpt-4o", model_provider="openai")',
          'out = (model | StrOutputParser()).invoke("Pipeline test")',
          'print(out)'
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Messages & Multi-Turn Conversation',
    topic: 'HumanMessage, SystemMessage, AIMessage & ChatHistory',
    missions: [
      {
        problem: 'Import message classes and build conversation list.',
        correctSequence: [
          'from langchain_core.messages import SystemMessage, HumanMessage, AIMessage',
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'chat = [SystemMessage("System Init"), HumanMessage("Hi"), AIMessage("Hello!")]',
          'print(model.invoke(chat).content)'
        ],
        availablePool: [
          'from langchain_core.messages import SystemMessage, HumanMessage, AIMessage',
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'chat = [SystemMessage("System Init"), HumanMessage("Hi"), AIMessage("Hello!")]',
          'print(model.invoke(chat).content)'
        ]
      },
      {
        problem: 'Store message history in InMemoryChatMessageHistory.',
        correctSequence: [
          'from langchain_core.chat_history import InMemoryChatMessageHistory',
          'history = InMemoryChatMessageHistory()',
          'history.add_user_message("My name is Alex")',
          'history.add_ai_message("Hello Alex")',
          'print(history.messages)'
        ],
        availablePool: [
          'from langchain_core.chat_history import InMemoryChatMessageHistory',
          'history = InMemoryChatMessageHistory()',
          'history.add_user_message("My name is Alex")',
          'history.add_ai_message("Hello Alex")',
          'print(history.messages)'
        ]
      },
      {
        problem: 'Wrap model with RunnableWithMessageHistory for automated chat history.',
        correctSequence: [
          'from langchain_core.runnables.history import RunnableWithMessageHistory',
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'with_history = RunnableWithMessageHistory(model, get_session_history)',
          'print(with_history.invoke("Hi", config={"configurable": {"session_id": "1"}}))'
        ],
        availablePool: [
          'from langchain_core.runnables.history import RunnableWithMessageHistory',
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'with_history = RunnableWithMessageHistory(model, get_session_history)',
          'print(with_history.invoke("Hi", config={"configurable": {"session_id": "1"}}))'
        ]
      },
      {
        problem: 'Trim message list using trim_messages helper.',
        correctSequence: [
          'from langchain_core.messages import trim_messages',
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'trimmed = trim_messages(messages, max_tokens=100, strategy="last", token_counter=model)',
          'print(len(trimmed))'
        ],
        availablePool: [
          'from langchain_core.messages import trim_messages',
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'trimmed = trim_messages(messages, max_tokens=100, strategy="last", token_counter=model)',
          'print(len(trimmed))'
        ]
      },
      {
        problem: 'Filter human messages using filter_messages.',
        correctSequence: [
          'from langchain_core.messages import filter_messages',
          'user_msgs = filter_messages(messages, include_types="human")',
          'print(user_msgs)'
        ],
        availablePool: [
          'from langchain_core.messages import filter_messages',
          'user_msgs = filter_messages(messages, include_types="human")',
          'print(user_msgs)'
        ]
      },
      {
        problem: 'Construct ToolMessage object representing tool execution response.',
        correctSequence: [
          'from langchain_core.messages import ToolMessage',
          'tool_msg = ToolMessage(content="Result: 42", tool_call_id="call_101")',
          'print(tool_msg)'
        ],
        availablePool: [
          'from langchain_core.messages import ToolMessage',
          'tool_msg = ToolMessage(content="Result: 42", tool_call_id="call_101")',
          'print(tool_msg)'
        ]
      },
      {
        problem: 'Convert messages list to dict format using message_to_dict.',
        correctSequence: [
          'from langchain_core.messages import message_to_dict',
          'dicts = [message_to_dict(m) for m in messages]',
          'print(dicts)'
        ],
        availablePool: [
          'from langchain_core.messages import message_to_dict',
          'dicts = [message_to_dict(m) for m in messages]',
          'print(dicts)'
        ]
      },
      {
        problem: 'Reconstruct messages list from dict using messages_from_dict.',
        correctSequence: [
          'from langchain_core.messages import messages_from_dict',
          'reconstructed = messages_from_dict(dicts)',
          'print(reconstructed)'
        ],
        availablePool: [
          'from langchain_core.messages import messages_from_dict',
          'reconstructed = messages_from_dict(dicts)',
          'print(reconstructed)'
        ]
      },
      {
        problem: 'Combine system prompt, user prompt, and assistant reply in conversation thread.',
        correctSequence: [
          'from langchain_core.messages import SystemMessage, HumanMessage, AIMessage',
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'thread = [SystemMessage("Bot"), HumanMessage("Task 1"), AIMessage("Done"), HumanMessage("Task 2")]',
          'print(model.invoke(thread).content)'
        ],
        availablePool: [
          'from langchain_core.messages import SystemMessage, HumanMessage, AIMessage',
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'thread = [SystemMessage("Bot"), HumanMessage("Task 1"), AIMessage("Done"), HumanMessage("Task 2")]',
          'print(model.invoke(thread).content)'
        ]
      },
      {
        problem: 'Assemble complete multi-turn conversation script with init_chat_model.',
        correctSequence: [
          'from langchain.chat_models import init_chat_model',
          'from langchain_core.messages import HumanMessage, AIMessage',
          'model = init_chat_model("gpt-4o")',
          'history = [HumanMessage("Remember: 42"), AIMessage("Got it!")]',
          'res = model.invoke(history + [HumanMessage("What number?")])',
          'print(res.content)'
        ],
        availablePool: [
          'from langchain.chat_models import init_chat_model',
          'from langchain_core.messages import HumanMessage, AIMessage',
          'model = init_chat_model("gpt-4o")',
          'history = [HumanMessage("Remember: 42"), AIMessage("Got it!")]',
          'res = model.invoke(history + [HumanMessage("What number?")])',
          'print(res.content)'
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Prompts + Structured Output + Runnable Architecture',
    topic: 'ChatPromptTemplate, LCEL & pydantic with_structured_output',
    missions: [
      {
        problem: 'Build ChatPromptTemplate and pipe into init_chat_model() with StrOutputParser.',
        correctSequence: [
          'from langchain_core.prompts import ChatPromptTemplate',
          'from langchain.chat_models import init_chat_model',
          'from langchain_core.output_parsers import StrOutputParser',
          'prompt = ChatPromptTemplate.from_template("Explain {topic} in 1 sentence.")',
          'model = init_chat_model("gpt-4o")',
          'chain = prompt | model | StrOutputParser()',
          'print(chain.invoke({"topic": "LangChain LCEL"}))'
        ],
        availablePool: [
          'from langchain_core.prompts import ChatPromptTemplate',
          'from langchain.chat_models import init_chat_model',
          'from langchain_core.output_parsers import StrOutputParser',
          'prompt = ChatPromptTemplate.from_template("Explain {topic} in 1 sentence.")',
          'model = init_chat_model("gpt-4o")',
          'chain = prompt | model | StrOutputParser()',
          'print(chain.invoke({"topic": "LangChain LCEL"}))'
        ]
      },
      {
        problem: 'Define Pydantic schema and extract structured output using model.with_structured_output().',
        correctSequence: [
          'from pydantic import BaseModel, Field',
          'from langchain.chat_models import init_chat_model',
          'class User(BaseModel):',
          '    name: str = Field(description="Name")',
          '    age: int = Field(description="Age")',
          'model = init_chat_model("gpt-4o")',
          'structured_llm = model.with_structured_output(User)',
          'print(structured_llm.invoke("Alex is 25"))'
        ],
        availablePool: [
          'from pydantic import BaseModel, Field',
          'from langchain.chat_models import init_chat_model',
          'class User(BaseModel):',
          '    name: str = Field(description="Name")',
          '    age: int = Field(description="Age")',
          'model = init_chat_model("gpt-4o")',
          'structured_llm = model.with_structured_output(User)',
          'print(structured_llm.invoke("Alex is 25"))'
        ]
      },
      {
        problem: 'Use RunnablePassthrough to pass raw string input into prompt template.',
        correctSequence: [
          'from langchain_core.runnables import RunnablePassthrough',
          'from langchain_core.prompts import ChatPromptTemplate',
          'from langchain.chat_models import init_chat_model',
          'prompt = ChatPromptTemplate.from_template("Answer: {text}")',
          'chain = {"text": RunnablePassthrough()} | prompt | init_chat_model("gpt-4o")',
          'print(chain.invoke("What is LCEL?").content)'
        ],
        availablePool: [
          'from langchain_core.runnables import RunnablePassthrough',
          'from langchain_core.prompts import ChatPromptTemplate',
          'from langchain.chat_models import init_chat_model',
          'prompt = ChatPromptTemplate.from_template("Answer: {text}")',
          'chain = {"text": RunnablePassthrough()} | prompt | init_chat_model("gpt-4o")',
          'print(chain.invoke("What is LCEL?").content)'
        ]
      },
      {
        problem: 'Use RunnableParallel to execute two LCEL chains in parallel.',
        correctSequence: [
          'from langchain_core.runnables import RunnableParallel',
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'parallel_chain = RunnableParallel(joke=joke_chain, poem=poem_chain)',
          'print(parallel_chain.invoke({"topic": "robots"}))'
        ],
        availablePool: [
          'from langchain_core.runnables import RunnableParallel',
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'parallel_chain = RunnableParallel(joke=joke_chain, poem=poem_chain)',
          'print(parallel_chain.invoke({"topic": "robots"}))'
        ]
      },
      {
        problem: 'Use RunnableLambda to transform chain output with custom Python function.',
        correctSequence: [
          'from langchain_core.runnables import RunnableLambda',
          'upper = RunnableLambda(lambda text: text.upper())',
          'chain = model | StrOutputParser() | upper',
          'print(chain.invoke("hello world"))'
        ],
        availablePool: [
          'from langchain_core.runnables import RunnableLambda',
          'upper = RunnableLambda(lambda text: text.upper())',
          'chain = model | StrOutputParser() | upper',
          'print(chain.invoke("hello world"))'
        ]
      },
      {
        problem: 'Use MessagesPlaceholder to dynamically insert chat history into prompt.',
        correctSequence: [
          'from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder',
          'prompt = ChatPromptTemplate.from_messages([("system", "Role"), MessagesPlaceholder("history"), ("human", "{input}")])',
          'chain = prompt | init_chat_model("gpt-4o")',
          'print(chain.invoke({"history": [], "input": "Hi"}).content)'
        ],
        availablePool: [
          'from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder',
          'prompt = ChatPromptTemplate.from_messages([("system", "Role"), MessagesPlaceholder("history"), ("human", "{input}")])',
          'chain = prompt | init_chat_model("gpt-4o")',
          'print(chain.invoke({"history": [], "input": "Hi"}).content)'
        ]
      },
      {
        problem: 'Bind runtime parameters to model using model.bind(stop=["\\n"]).',
        correctSequence: [
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'bound_model = model.bind(stop=["END"])',
          'print(bound_model.invoke("Count 1 to 5 END").content)'
        ],
        availablePool: [
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'bound_model = model.bind(stop=["END"])',
          'print(bound_model.invoke("Count 1 to 5 END").content)'
        ]
      },
      {
        problem: 'Create PromptTemplate for plain text generation.',
        correctSequence: [
          'from langchain_core.prompts import PromptTemplate',
          'prompt = PromptTemplate.from_template("Write a poem about {subject}")',
          'print(prompt.format(subject="cyberpunk"))'
        ],
        availablePool: [
          'from langchain_core.prompts import PromptTemplate',
          'prompt = PromptTemplate.from_template("Write a poem about {subject}")',
          'print(prompt.format(subject="cyberpunk"))'
        ]
      },
      {
        problem: 'Extract list of strings using Pydantic structured output.',
        correctSequence: [
          'from pydantic import BaseModel, Field',
          'class Keywords(BaseModel): keywords: list[str] = Field(description="Tags")',
          'model = init_chat_model("gpt-4o")',
          'extractor = model.with_structured_output(Keywords)',
          'print(extractor.invoke("Python, LangChain, AI"))'
        ],
        availablePool: [
          'from pydantic import BaseModel, Field',
          'class Keywords(BaseModel): keywords: list[str] = Field(description="Tags")',
          'model = init_chat_model("gpt-4o")',
          'extractor = model.with_structured_output(Keywords)',
          'print(extractor.invoke("Python, LangChain, AI"))'
        ]
      },
      {
        problem: 'Assemble full LCEL runnable pipeline with prompt, init_chat_model & Pydantic output.',
        correctSequence: [
          '!pip install langchain pydantic',
          'from langchain.chat_models import init_chat_model',
          'from langchain_core.prompts import ChatPromptTemplate',
          'prompt = ChatPromptTemplate.from_template("Extract user: {text}")',
          'chain = prompt | init_chat_model("gpt-4o").with_structured_output(User)',
          'print(chain.invoke({"text": "Rohan age 30"}))'
        ],
        availablePool: [
          '!pip install langchain pydantic',
          'from langchain.chat_models import init_chat_model',
          'from langchain_core.prompts import ChatPromptTemplate',
          'prompt = ChatPromptTemplate.from_template("Extract user: {text}")',
          'chain = prompt | init_chat_model("gpt-4o").with_structured_output(User)',
          'print(chain.invoke({"text": "Rohan age 30"}))'
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Tools',
    topic: '@tool decorator, TavilySearchResults & bind_tools',
    missions: [
      {
        problem: 'Create custom tool using @tool decorator and bind to init_chat_model().',
        correctSequence: [
          'from langchain_core.tools import tool',
          'from langchain.chat_models import init_chat_model',
          '@tool',
          'def add(a: int, b: int) -> int:',
          '    """Adds two numbers."""',
          '    return a + b',
          'model = init_chat_model("gpt-4o").bind_tools([add])',
          'res = model.invoke("What is 15 + 25?")',
          'print(res.tool_calls)'
        ],
        availablePool: [
          'from langchain_core.tools import tool',
          'from langchain.chat_models import init_chat_model',
          '@tool',
          'def add(a: int, b: int) -> int:',
          '    """Adds two numbers."""',
          '    return a + b',
          'model = init_chat_model("gpt-4o").bind_tools([add])',
          'res = model.invoke("What is 15 + 25?")',
          'print(res.tool_calls)'
        ]
      },
      {
        problem: 'Initialize TavilySearchResults tool and invoke web search.',
        correctSequence: [
          '!pip install langchain-community tavily-python',
          'from langchain_community.tools.tavily_search import TavilySearchResults',
          'search_tool = TavilySearchResults(max_results=3)',
          'print(search_tool.invoke("LangGraph release date"))'
        ],
        availablePool: [
          '!pip install langchain-community tavily-python',
          'from langchain_community.tools.tavily_search import TavilySearchResults',
          'search_tool = TavilySearchResults(max_results=3)',
          'print(search_tool.invoke("LangGraph release date"))'
        ]
      },
      {
        problem: 'Initialize PythonREPLTool for running dynamic Python code.',
        correctSequence: [
          '!pip install langchain-experimental',
          'from langchain_experimental.tools import PythonREPLTool',
          'repl_tool = PythonREPLTool()',
          'print(repl_tool.invoke("print(10 ** 2)"))'
        ],
        availablePool: [
          '!pip install langchain-experimental',
          'from langchain_experimental.tools import PythonREPLTool',
          'repl_tool = PythonREPLTool()',
          'print(repl_tool.invoke("print(10 ** 2)"))'
        ]
      },
      {
        problem: 'Create tool from custom function using StructuredTool.from_function.',
        correctSequence: [
          'from langchain_core.tools import StructuredTool',
          'def multiply(a: int, b: int) -> int: return a * b',
          'calc_tool = StructuredTool.from_function(func=multiply, name="multiply")',
          'print(calc_tool.invoke({"a": 4, "b": 5}))'
        ],
        availablePool: [
          'from langchain_core.tools import StructuredTool',
          'def multiply(a: int, b: int) -> int: return a * b',
          'calc_tool = StructuredTool.from_function(func=multiply, name="multiply")',
          'print(calc_tool.invoke({"a": 4, "b": 5}))'
        ]
      },
      {
        problem: 'Construct ToolMessage response from tool output.',
        correctSequence: [
          'from langchain_core.messages import ToolMessage',
          'output = add.invoke({"a": 10, "b": 20})',
          'msg = ToolMessage(content=str(output), tool_call_id="call_99")',
          'print(msg)'
        ],
        availablePool: [
          'from langchain_core.messages import ToolMessage',
          'output = add.invoke({"a": 10, "b": 20})',
          'msg = ToolMessage(content=str(output), tool_call_id="call_99")',
          'print(msg)'
        ]
      },
      {
        problem: 'Import DuckDuckGoSearchRun tool from langchain_community.',
        correctSequence: [
          '!pip install langchain-community duckduckgo-search',
          'from langchain_community.tools import DuckDuckGoSearchRun',
          'search = DuckDuckGoSearchRun()',
          'print(search.invoke("LangChain init_chat_model"))'
        ],
        availablePool: [
          '!pip install langchain-community duckduckgo-search',
          'from langchain_community.tools import DuckDuckGoSearchRun',
          'search = DuckDuckGoSearchRun()',
          'print(search.invoke("LangChain init_chat_model"))'
        ]
      },
      {
        problem: 'Force specific tool execution using tool_choice argument.',
        correctSequence: [
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'forced_model = model.bind_tools([add], tool_choice="add")',
          'print(forced_model.invoke("Hi").tool_calls)'
        ],
        availablePool: [
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'forced_model = model.bind_tools([add], tool_choice="add")',
          'print(forced_model.invoke("Hi").tool_calls)'
        ]
      },
      {
        problem: 'Inspect tool metadata name and description.',
        correctSequence: [
          'from langchain_core.tools import tool',
          '@tool',
          'def get_weather(city: str) -> str:',
          '    """Fetches current weather for a city."""',
          '    return "Sunny 25C"',
          'print(get_weather.name, get_weather.description)'
        ],
        availablePool: [
          'from langchain_core.tools import tool',
          '@tool',
          'def get_weather(city: str) -> str:',
          '    """Fetches current weather for a city."""',
          '    return "Sunny 25C"',
          'print(get_weather.name, get_weather.description)'
        ]
      },
      {
        problem: 'Execute tool and append ToolMessage into chat history.',
        correctSequence: [
          'from langchain_core.messages import HumanMessage',
          'model_res = model.invoke([HumanMessage("Add 5 and 5")])',
          'tool_call = model_res.tool_calls[0]',
          'result = add.invoke(tool_call["args"])',
          'print(result)'
        ],
        availablePool: [
          'from langchain_core.messages import HumanMessage',
          'model_res = model.invoke([HumanMessage("Add 5 and 5")])',
          'tool_call = model_res.tool_calls[0]',
          'result = add.invoke(tool_call["args"])',
          'print(result)'
        ]
      },
      {
        problem: 'Assemble full tool-calling script with Tavily web search and init_chat_model().',
        correctSequence: [
          '!pip install langchain langchain-community tavily-python',
          'from langchain.chat_models import init_chat_model',
          'from langchain_community.tools.tavily_search import TavilySearchResults',
          'tools = [TavilySearchResults(max_results=2)]',
          'model = init_chat_model("gpt-4o").bind_tools(tools)',
          'print(model.invoke("Search latest AI news").tool_calls)'
        ],
        availablePool: [
          '!pip install langchain langchain-community tavily-python',
          'from langchain.chat_models import init_chat_model',
          'from langchain_community.tools.tavily_search import TavilySearchResults',
          'tools = [TavilySearchResults(max_results=2)]',
          'model = init_chat_model("gpt-4o").bind_tools(tools)',
          'print(model.invoke("Search latest AI news").tool_calls)'
        ]
      }
    ]
  },
  {
    id: 5,
    title: 'create_agent — Modern Agent Building',
    topic: 'create_react_agent & AgentExecutor',
    missions: [
      {
        problem: 'Import create_react_agent and AgentExecutor from langchain.agents.',
        correctSequence: [
          'from langchain.agents import create_react_agent, AgentExecutor',
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'agent = create_react_agent(model, tools, prompt)',
          'executor = AgentExecutor(agent=agent, tools=tools, verbose=True)',
          'print(executor.invoke({"input": "Search weather"}))'
        ],
        availablePool: [
          'from langchain.agents import create_react_agent, AgentExecutor',
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'agent = create_react_agent(model, tools, prompt)',
          'executor = AgentExecutor(agent=agent, tools=tools, verbose=True)',
          'print(executor.invoke({"input": "Search weather"}))'
        ]
      },
      {
        problem: 'Pull hwchase17/react prompt from LangChain Hub.',
        correctSequence: [
          '!pip install langchainhub',
          'from langchain import hub',
          'prompt = hub.pull("hwchase17/react")',
          'print(prompt.template)'
        ],
        availablePool: [
          '!pip install langchainhub',
          'from langchain import hub',
          'prompt = hub.pull("hwchase17/react")',
          'print(prompt.template)'
        ]
      },
      {
        problem: 'Configure max_iterations=5 in AgentExecutor to limit loop execution.',
        correctSequence: [
          'from langchain.agents import AgentExecutor',
          'executor = AgentExecutor(agent=agent, tools=tools, max_iterations=5)',
          'print(executor.max_iterations)'
        ],
        availablePool: [
          'from langchain.agents import AgentExecutor',
          'executor = AgentExecutor(agent=agent, tools=tools, max_iterations=5)',
          'print(executor.max_iterations)'
        ]
      },
      {
        problem: 'Configure handle_parsing_errors=True in AgentExecutor.',
        correctSequence: [
          'from langchain.agents import AgentExecutor',
          'executor = AgentExecutor(agent=agent, tools=tools, handle_parsing_errors=True)',
          'print(executor.handle_parsing_errors)'
        ],
        availablePool: [
          'from langchain.agents import AgentExecutor',
          'executor = AgentExecutor(agent=agent, tools=tools, handle_parsing_errors=True)',
          'print(executor.handle_parsing_errors)'
        ]
      },
      {
        problem: 'Create ToolCallingAgent using create_tool_calling_agent.',
        correctSequence: [
          'from langchain.agents import create_tool_calling_agent',
          'from langchain.chat_models import init_chat_model',
          'agent = create_tool_calling_agent(init_chat_model("gpt-4o"), tools, prompt)',
          'executor = AgentExecutor(agent=agent, tools=tools)',
          'print(executor.invoke({"input": "Run task"}))'
        ],
        availablePool: [
          'from langchain.agents import create_tool_calling_agent',
          'from langchain.chat_models import init_chat_model',
          'agent = create_tool_calling_agent(init_chat_model("gpt-4o"), tools, prompt)',
          'executor = AgentExecutor(agent=agent, tools=tools)',
          'print(executor.invoke({"input": "Run task"}))'
        ]
      },
      {
        problem: 'Stream intermediate agent steps using executor.stream().',
        correctSequence: [
          'from langchain.agents import AgentExecutor',
          'for step in executor.stream({"input": "Plan event"}):',
          '    print(step)'
        ],
        availablePool: [
          'from langchain.agents import AgentExecutor',
          'for step in executor.stream({"input": "Plan event"}):',
          '    print(step)'
        ]
      },
      {
        problem: 'Enable return_intermediate_steps=True to inspect tool outputs.',
        correctSequence: [
          'from langchain.agents import AgentExecutor',
          'executor = AgentExecutor(agent=agent, tools=tools, return_intermediate_steps=True)',
          'res = executor.invoke({"input": "Query"})',
          'print(res["intermediate_steps"])'
        ],
        availablePool: [
          'from langchain.agents import AgentExecutor',
          'executor = AgentExecutor(agent=agent, tools=tools, return_intermediate_steps=True)',
          'res = executor.invoke({"input": "Query"})',
          'print(res["intermediate_steps"])'
        ]
      },
      {
        problem: 'Create OpenAI functions agent using create_openai_functions_agent.',
        correctSequence: [
          'from langchain.agents import create_openai_functions_agent',
          'agent = create_openai_functions_agent(llm, tools, prompt)',
          'print(agent)'
        ],
        availablePool: [
          'from langchain.agents import create_openai_functions_agent',
          'agent = create_openai_functions_agent(llm, tools, prompt)',
          'print(agent)'
        ]
      },
      {
        problem: 'Attach custom prompt with system instructions to ReAct agent.',
        correctSequence: [
          'from langchain_core.prompts import ChatPromptTemplate',
          'prompt = ChatPromptTemplate.from_messages([("system", "You are a cyber assistant"), ("human", "{input}")])',
          'agent = create_tool_calling_agent(model, tools, prompt)'
        ],
        availablePool: [
          'from langchain_core.prompts import ChatPromptTemplate',
          'prompt = ChatPromptTemplate.from_messages([("system", "You are a cyber assistant"), ("human", "{input}")])',
          'agent = create_tool_calling_agent(model, tools, prompt)'
        ]
      },
      {
        problem: 'Assemble complete ReAct Agent system with init_chat_model, tools & AgentExecutor.',
        correctSequence: [
          '!pip install langchain langchain-openai langchainhub',
          'from langchain.chat_models import init_chat_model',
          'from langchain.agents import create_react_agent, AgentExecutor',
          'from langchain import hub',
          'prompt = hub.pull("hwchase17/react")',
          'model = init_chat_model("gpt-4o")',
          'agent = create_react_agent(model, tools, prompt)',
          'executor = AgentExecutor(agent=agent, tools=tools)',
          'print(executor.invoke({"input": "Execute mission"}))'
        ],
        availablePool: [
          '!pip install langchain langchain-openai langchainhub',
          'from langchain.chat_models import init_chat_model',
          'from langchain.agents import create_react_agent, AgentExecutor',
          'from langchain import hub',
          'prompt = hub.pull("hwchase17/react")',
          'model = init_chat_model("gpt-4o")',
          'agent = create_react_agent(model, tools, prompt)',
          'executor = AgentExecutor(agent=agent, tools=tools)',
          'print(executor.invoke({"input": "Execute mission"}))'
        ]
      }
    ]
  },
  {
    id: 6,
    title: 'Middleware',
    topic: 'Callbacks, Handlers, RateLimiter & TrimMessages',
    missions: [
      {
        problem: 'Import BaseCallbackHandler and write custom event callback middleware.',
        correctSequence: [
          'from langchain_core.callbacks import BaseCallbackHandler',
          'class CustomCallback(BaseCallbackHandler):',
          '    def on_llm_start(self, serialized, prompts, **kwargs):',
          '        print(">>> Model Started Execution!")',
          'model = init_chat_model("gpt-4o")',
          'model.invoke("Test", config={"callbacks": [CustomCallback()]})'
        ],
        availablePool: [
          'from langchain_core.callbacks import BaseCallbackHandler',
          'class CustomCallback(BaseCallbackHandler):',
          '    def on_llm_start(self, serialized, prompts, **kwargs):',
          '        print(">>> Model Started Execution!")',
          'model = init_chat_model("gpt-4o")',
          'model.invoke("Test", config={"callbacks": [CustomCallback()]})'
        ]
      },
      {
        problem: 'Attach StdOutCallbackHandler for console logging.',
        correctSequence: [
          'from langchain_core.callbacks import StdOutCallbackHandler',
          'handler = StdOutCallbackHandler()',
          'model.invoke("Hello", config={"callbacks": [handler]})'
        ],
        availablePool: [
          'from langchain_core.callbacks import StdOutCallbackHandler',
          'handler = StdOutCallbackHandler()',
          'model.invoke("Hello", config={"callbacks": [handler]})'
        ]
      },
      {
        problem: 'Import InMemoryRateLimiter to rate limit LLM API calls.',
        correctSequence: [
          'from langchain_core.rate_limiters import InMemoryRateLimiter',
          'from langchain.chat_models import init_chat_model',
          'rate_limiter = InMemoryRateLimiter(requests_per_second=2)',
          'model = init_chat_model("gpt-4o", rate_limiter=rate_limiter)',
          'print(model.invoke("Rate limit test").content)'
        ],
        availablePool: [
          'from langchain_core.rate_limiters import InMemoryRateLimiter',
          'from langchain.chat_models import init_chat_model',
          'rate_limiter = InMemoryRateLimiter(requests_per_second=2)',
          'model = init_chat_model("gpt-4o", rate_limiter=rate_limiter)',
          'print(model.invoke("Rate limit test").content)'
        ]
      },
      {
        problem: 'Use get_openai_callback context manager to track token usage and costs.',
        correctSequence: [
          'from langchain_community.callbacks import get_openai_callback',
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'with get_openai_callback() as cb:',
          '    model.invoke("Calculate tokens")',
          '    print(f"Total Tokens: {cb.total_tokens}, Cost: ${cb.total_cost}")'
        ],
        availablePool: [
          'from langchain_community.callbacks import get_openai_callback',
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'with get_openai_callback() as cb:',
          '    model.invoke("Calculate tokens")',
          '    print(f"Total Tokens: {cb.total_tokens}, Cost: ${cb.total_cost}")'
        ]
      },
      {
        problem: 'Create AsyncCallbackHandler for non-blocking token streaming.',
        correctSequence: [
          'from langchain_core.callbacks import AsyncCallbackHandler',
          'class AsyncHandler(AsyncCallbackHandler):',
          '    async def on_llm_new_token(self, token: str, **kwargs):',
          '        print(token, end="")'
        ],
        availablePool: [
          'from langchain_core.callbacks import AsyncCallbackHandler',
          'class AsyncHandler(AsyncCallbackHandler):',
          '    async def on_llm_new_token(self, token: str, **kwargs):',
          '        print(token, end="")'
        ]
      },
      {
        problem: 'Log events to file using FileCallbackHandler.',
        correctSequence: [
          'from langchain_community.callbacks import FileCallbackHandler',
          'handler = FileCallbackHandler("agent_runs.log")',
          'model.invoke("Log this run", config={"callbacks": [handler]})'
        ],
        availablePool: [
          'from langchain_community.callbacks import FileCallbackHandler',
          'handler = FileCallbackHandler("agent_runs.log")',
          'model.invoke("Log this run", config={"callbacks": [handler]})'
        ]
      },
      {
        problem: 'Attach custom tags and metadata to chain config.',
        correctSequence: [
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'res = model.invoke("Hi", config={"tags": ["prod", "v1"], "metadata": {"user": "Alex"}})',
          'print(res.content)'
        ],
        availablePool: [
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'res = model.invoke("Hi", config={"tags": ["prod", "v1"], "metadata": {"user": "Alex"}})',
          'print(res.content)'
        ]
      },
      {
        problem: 'Trim message buffer using trim_messages runnable.',
        correctSequence: [
          'from langchain_core.messages import trim_messages',
          'trimmed_chain = trim_messages | model',
          'print(trimmed_chain.invoke(messages))'
        ],
        availablePool: [
          'from langchain_core.messages import trim_messages',
          'trimmed_chain = trim_messages | model',
          'print(trimmed_chain.invoke(messages))'
        ]
      },
      {
        problem: 'Combine rate limiter with callback handlers.',
        correctSequence: [
          'from langchain_core.rate_limiters import InMemoryRateLimiter',
          'limiter = InMemoryRateLimiter(requests_per_second=5)',
          'model = init_chat_model("gpt-4o", rate_limiter=limiter)',
          'print(model.invoke("Test", config={"callbacks": [CustomCallback()]}).content)'
        ],
        availablePool: [
          'from langchain_core.rate_limiters import InMemoryRateLimiter',
          'limiter = InMemoryRateLimiter(requests_per_second=5)',
          'model = init_chat_model("gpt-4o", rate_limiter=limiter)',
          'print(model.invoke("Test", config={"callbacks": [CustomCallback()]}).content)'
        ]
      },
      {
        problem: 'Assemble complete middleware system with rate limiter, token tracker & init_chat_model().',
        correctSequence: [
          '!pip install langchain langchain-community',
          'from langchain.chat_models import init_chat_model',
          'from langchain_core.rate_limiters import InMemoryRateLimiter',
          'from langchain_community.callbacks import get_openai_callback',
          'model = init_chat_model("gpt-4o", rate_limiter=InMemoryRateLimiter(requests_per_second=3))',
          'with get_openai_callback() as cb:',
          '    print(model.invoke("Middleware test").content)',
          '    print("Cost:", cb.total_cost)'
        ],
        availablePool: [
          '!pip install langchain langchain-community',
          'from langchain.chat_models import init_chat_model',
          'from langchain_core.rate_limiters import InMemoryRateLimiter',
          'from langchain_community.callbacks import get_openai_callback',
          'model = init_chat_model("gpt-4o", rate_limiter=InMemoryRateLimiter(requests_per_second=3))',
          'with get_openai_callback() as cb:',
          '    print(model.invoke("Middleware test").content)',
          '    print("Cost:", cb.total_cost)'
        ]
      }
    ]
  },
  {
    id: 7,
    title: 'RAG — Documents, Embeddings, Vector Stores',
    topic: 'PyPDFLoader, TextSplitter, OpenAIEmbeddings & Chroma',
    missions: [
      {
        problem: 'Load document using PyPDFLoader.',
        correctSequence: [
          '!pip install langchain-community pypdf',
          'from langchain_community.document_loaders import PyPDFLoader',
          'loader = PyPDFLoader("document.pdf")',
          'docs = loader.load()',
          'print(f"Loaded {len(docs)} pages")'
        ],
        availablePool: [
          '!pip install langchain-community pypdf',
          'from langchain_community.document_loaders import PyPDFLoader',
          'loader = PyPDFLoader("document.pdf")',
          'docs = loader.load()',
          'print(f"Loaded {len(docs)} pages")'
        ]
      },
      {
        problem: 'Split document into chunks using RecursiveCharacterTextSplitter.',
        correctSequence: [
          '!pip install langchain-text-splitters',
          'from langchain_text_splitters import RecursiveCharacterTextSplitter',
          'splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)',
          'chunks = splitter.split_documents(docs)',
          'print(f"Created {len(chunks)} chunks")'
        ],
        availablePool: [
          '!pip install langchain-text-splitters',
          'from langchain_text_splitters import RecursiveCharacterTextSplitter',
          'splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)',
          'chunks = splitter.split_documents(docs)',
          'print(f"Created {len(chunks)} chunks")'
        ]
      },
      {
        problem: 'Initialize OpenAIEmbeddings model.',
        correctSequence: [
          '!pip install langchain-openai',
          'from langchain_openai import OpenAIEmbeddings',
          'embeddings = OpenAIEmbeddings(model="text-embedding-3-small")',
          'vec = embeddings.embed_query("LangChain")',
          'print(len(vec))'
        ],
        availablePool: [
          '!pip install langchain-openai',
          'from langchain_openai import OpenAIEmbeddings',
          'embeddings = OpenAIEmbeddings(model="text-embedding-3-small")',
          'vec = embeddings.embed_query("LangChain")',
          'print(len(vec))'
        ]
      },
      {
        problem: 'Store document chunks into Chroma vector store database.',
        correctSequence: [
          '!pip install langchain-chroma chromadb',
          'from langchain_chroma import Chroma',
          'vectorstore = Chroma.from_documents(chunks, embeddings)',
          'print("Chroma DB initialized")'
        ],
        availablePool: [
          '!pip install langchain-chroma chromadb',
          'from langchain_chroma import Chroma',
          'vectorstore = Chroma.from_documents(chunks, embeddings)',
          'print("Chroma DB initialized")'
        ]
      },
      {
        problem: 'Convert vectorstore to retriever object.',
        correctSequence: [
          'retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 3})',
          'results = retriever.invoke("What is RAG?")',
          'print(len(results))'
        ],
        availablePool: [
          'retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 3})',
          'results = retriever.invoke("What is RAG?")',
          'print(len(results))'
        ]
      },
      {
        problem: 'Scrape Web URL content using WebBaseLoader.',
        correctSequence: [
          '!pip install langchain-community beautifulsoup4',
          'from langchain_community.document_loaders import WebBaseLoader',
          'loader = WebBaseLoader("https://python.langchain.com")',
          'web_docs = loader.load()',
          'print(web_docs[0].page_content[:100])'
        ],
        availablePool: [
          '!pip install langchain-community beautifulsoup4',
          'from langchain_community.document_loaders import WebBaseLoader',
          'loader = WebBaseLoader("https://python.langchain.com")',
          'web_docs = loader.load()',
          'print(web_docs[0].page_content[:100])'
        ]
      },
      {
        problem: 'Use FAISS in-memory vector store.',
        correctSequence: [
          '!pip install langchain-community faiss-cpu',
          'from langchain_community.vectorstores import FAISS',
          'db = FAISS.from_documents(chunks, embeddings)',
          'print(db.similarity_search("Query"))'
        ],
        availablePool: [
          '!pip install langchain-community faiss-cpu',
          'from langchain_community.vectorstores import FAISS',
          'db = FAISS.from_documents(chunks, embeddings)',
          'print(db.similarity_search("Query"))'
        ]
      },
      {
        problem: 'Perform similarity search with score on vectorstore.',
        correctSequence: [
          'results = vectorstore.similarity_search_with_score("LangChain LCEL", k=2)',
          'for doc, score in results:',
          '    print(f"Score: {score}, Text: {doc.page_content[:50]}")'
        ],
        availablePool: [
          'results = vectorstore.similarity_search_with_score("LangChain LCEL", k=2)',
          'for doc, score in results:',
          '    print(f"Score: {score}, Text: {doc.page_content[:50]}")'
        ]
      },
      {
        problem: 'Build LCEL RAG chain using retriever, init_chat_model() & StrOutputParser.',
        correctSequence: [
          'from langchain_core.runnables import RunnablePassthrough',
          'from langchain.chat_models import init_chat_model',
          'from langchain_core.output_parsers import StrOutputParser',
          'rag_chain = {"context": retriever, "question": RunnablePassthrough()} | prompt | init_chat_model("gpt-4o") | StrOutputParser()',
          'print(rag_chain.invoke("Explain RAG"))'
        ],
        availablePool: [
          'from langchain_core.runnables import RunnablePassthrough',
          'from langchain.chat_models import init_chat_model',
          'from langchain_core.output_parsers import StrOutputParser',
          'rag_chain = {"context": retriever, "question": RunnablePassthrough()} | prompt | init_chat_model("gpt-4o") | StrOutputParser()',
          'print(rag_chain.invoke("Explain RAG"))'
        ]
      },
      {
        problem: 'Assemble end-to-end RAG script from Loader to VectorStore & init_chat_model().',
        correctSequence: [
          '!pip install langchain langchain-community langchain-chroma langchain-openai',
          'from langchain_community.document_loaders import PyPDFLoader',
          'from langchain_text_splitters import RecursiveCharacterTextSplitter',
          'from langchain_openai import OpenAIEmbeddings',
          'from langchain_chroma import Chroma',
          'from langchain.chat_models import init_chat_model',
          'chunks = RecursiveCharacterTextSplitter().split_documents(PyPDFLoader("paper.pdf").load())',
          'retriever = Chroma.from_documents(chunks, OpenAIEmbeddings()).as_retriever()',
          'chain = {"context": retriever, "question": RunnablePassthrough()} | init_chat_model("gpt-4o")',
          'print(chain.invoke("RAG Summary"))'
        ],
        availablePool: [
          '!pip install langchain langchain-community langchain-chroma langchain-openai',
          'from langchain_community.document_loaders import PyPDFLoader',
          'from langchain_text_splitters import RecursiveCharacterTextSplitter',
          'from langchain_openai import OpenAIEmbeddings',
          'from langchain_chroma import Chroma',
          'from langchain.chat_models import init_chat_model',
          'chunks = RecursiveCharacterTextSplitter().split_documents(PyPDFLoader("paper.pdf").load())',
          'retriever = Chroma.from_documents(chunks, OpenAIEmbeddings()).as_retriever()',
          'chain = {"context": retriever, "question": RunnablePassthrough()} | init_chat_model("gpt-4o")',
          'print(chain.invoke("RAG Summary"))'
        ]
      }
    ]
  },
  {
    id: 8,
    title: 'Retrieval-as-a-Tool (Agentic RAG)',
    topic: 'create_retriever_tool & Tool-calling Agent',
    missions: [
      {
        problem: 'Import create_retriever_tool and convert retriever to agent tool.',
        correctSequence: [
          'from langchain.tools.retriever import create_retriever_tool',
          'tool = create_retriever_tool(retriever, "search_policy", "Search company policy docs")',
          'print(tool.name, tool.description)'
        ],
        availablePool: [
          'from langchain.tools.retriever import create_retriever_tool',
          'tool = create_retriever_tool(retriever, "search_policy", "Search company policy docs")',
          'print(tool.name, tool.description)'
        ]
      },
      {
        problem: 'Bind retriever tool to init_chat_model().',
        correctSequence: [
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o").bind_tools([retriever_tool])',
          'print(model.invoke("Check policy on vacation").tool_calls)'
        ],
        availablePool: [
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o").bind_tools([retriever_tool])',
          'print(model.invoke("Check policy on vacation").tool_calls)'
        ]
      },
      {
        problem: 'Build Agentic RAG executor using create_react_agent.',
        correctSequence: [
          'from langchain.agents import create_react_agent, AgentExecutor',
          'agent = create_react_agent(init_chat_model("gpt-4o"), [retriever_tool], prompt)',
          'executor = AgentExecutor(agent=agent, tools=[retriever_tool])',
          'print(executor.invoke({"input": "Search policy"}))'
        ],
        availablePool: [
          'from langchain.agents import create_react_agent, AgentExecutor',
          'agent = create_react_agent(init_chat_model("gpt-4o"), [retriever_tool], prompt)',
          'executor = AgentExecutor(agent=agent, tools=[retriever_tool])',
          'print(executor.invoke({"input": "Search policy"}))'
        ]
      },
      {
        problem: 'Define Self-RAG Document Grader schema.',
        correctSequence: [
          'from pydantic import BaseModel, Field',
          'class GradeDocs(BaseModel): binary_score: str = Field(description="Score \'yes\' or \'no\'")',
          'grader = init_chat_model("gpt-4o").with_structured_output(GradeDocs)',
          'print(grader.invoke("Doc relevance check"))'
        ],
        availablePool: [
          'from pydantic import BaseModel, Field',
          'class GradeDocs(BaseModel): binary_score: str = Field(description="Score \'yes\' or \'no\'")',
          'grader = init_chat_model("gpt-4o").with_structured_output(GradeDocs)',
          'print(grader.invoke("Doc relevance check"))'
        ]
      },
      {
        problem: 'Define Hallucination Grader schema.',
        correctSequence: [
          'from pydantic import BaseModel, Field',
          'class GradeHallucination(BaseModel): binary_score: str = Field(description="Is grounded?")',
          'hallucination_grader = init_chat_model("gpt-4o").with_structured_output(GradeHallucination)',
          'print(hallucination_grader.invoke("Check factuality"))'
        ],
        availablePool: [
          'from pydantic import BaseModel, Field',
          'class GradeHallucination(BaseModel): binary_score: str = Field(description="Is grounded?")',
          'hallucination_grader = init_chat_model("gpt-4o").with_structured_output(GradeHallucination)',
          'print(hallucination_grader.invoke("Check factuality"))'
        ]
      },
      {
        problem: 'Define Answer Grader schema.',
        correctSequence: [
          'from pydantic import BaseModel, Field',
          'class GradeAnswer(BaseModel): binary_score: str = Field(description="Addresses question?")',
          'answer_grader = init_chat_model("gpt-4o").with_structured_output(GradeAnswer)',
          'print(answer_grader.invoke("Check answer quality"))'
        ],
        availablePool: [
          'from pydantic import BaseModel, Field',
          'class GradeAnswer(BaseModel): binary_score: str = Field(description="Addresses question?")',
          'answer_grader = init_chat_model("gpt-4o").with_structured_output(GradeAnswer)',
          'print(answer_grader.invoke("Check answer quality"))'
        ]
      },
      {
        problem: 'Create Query Rewriter prompt for Agentic RAG fallback search.',
        correctSequence: [
          'from langchain_core.prompts import ChatPromptTemplate',
          'from langchain.chat_models import init_chat_model',
          're_write_prompt = ChatPromptTemplate.from_template("Rewrite for search: {question}")',
          'rewriter = re_write_prompt | init_chat_model("gpt-4o")',
          'print(rewriter.invoke({"question": "bad query"}).content)'
        ],
        availablePool: [
          'from langchain_core.prompts import ChatPromptTemplate',
          'from langchain.chat_models import init_chat_model',
          're_write_prompt = ChatPromptTemplate.from_template("Rewrite for search: {question}")',
          'rewriter = re_write_prompt | init_chat_model("gpt-4o")',
          'print(rewriter.invoke({"question": "bad query"}).content)'
        ]
      },
      {
        problem: 'Use VectorStoreRetrieverMemory for conversational memory.',
        correctSequence: [
          'from langchain_community.memory import VectorStoreRetrieverMemory',
          'memory = VectorStoreRetrieverMemory(retriever=retriever)',
          'memory.save_context({"input": "My name is Alex"}, {"output": "Nice to meet you"})',
          'print(memory.load_memory_variables({"input": "What is my name?"}))'
        ],
        availablePool: [
          'from langchain_community.memory import VectorStoreRetrieverMemory',
          'memory = VectorStoreRetrieverMemory(retriever=retriever)',
          'memory.save_context({"input": "My name is Alex"}, {"output": "Nice to meet you"})',
          'print(memory.load_memory_variables({"input": "What is my name?"}))'
        ]
      },
      {
        problem: 'Configure Agentic RAG router schema.',
        correctSequence: [
          'from pydantic import BaseModel, Field',
          'class RouteQuery(BaseModel): datasource: str = Field(description="\'vectorstore\' or \'websearch\'")',
          'question_router = init_chat_model("gpt-4o").with_structured_output(RouteQuery)',
          'print(question_router.invoke("Where to search?"))'
        ],
        availablePool: [
          'from pydantic import BaseModel, Field',
          'class RouteQuery(BaseModel): datasource: str = Field(description="\'vectorstore\' or \'websearch\'")',
          'question_router = init_chat_model("gpt-4o").with_structured_output(RouteQuery)',
          'print(question_router.invoke("Where to search?"))'
        ]
      },
      {
        problem: 'Assemble complete Agentic RAG pipeline with create_retriever_tool, init_chat_model & AgentExecutor.',
        correctSequence: [
          '!pip install langchain langchain-openai langchain-chroma',
          'from langchain.tools.retriever import create_retriever_tool',
          'from langchain.agents import create_react_agent, AgentExecutor',
          'from langchain.chat_models import init_chat_model',
          'retriever_tool = create_retriever_tool(retriever, "doc_search", "Search DB")',
          'agent = create_react_agent(init_chat_model("gpt-4o"), [retriever_tool], prompt)',
          'executor = AgentExecutor(agent=agent, tools=[retriever_tool])',
          'print(executor.invoke({"input": "Agentic RAG Test"}))'
        ],
        availablePool: [
          '!pip install langchain langchain-openai langchain-chroma',
          'from langchain.tools.retriever import create_retriever_tool',
          'from langchain.agents import create_react_agent, AgentExecutor',
          'from langchain.chat_models import init_chat_model',
          'retriever_tool = create_retriever_tool(retriever, "doc_search", "Search DB")',
          'agent = create_react_agent(init_chat_model("gpt-4o"), [retriever_tool], prompt)',
          'executor = AgentExecutor(agent=agent, tools=[retriever_tool])',
          'print(executor.invoke({"input": "Agentic RAG Test"}))'
        ]
      }
    ]
  },
  {
    id: 9,
    title: 'LangGraph Fundamentals',
    topic: 'StateGraph, START, END & State Nodes',
    missions: [
      {
        problem: 'Import StateGraph, START, and END from langgraph.graph.',
        correctSequence: [
          '!pip install langgraph',
          'from langgraph.graph import StateGraph, START, END',
          'builder = StateGraph(dict)',
          'print(builder)'
        ],
        availablePool: [
          '!pip install langgraph',
          'from langgraph.graph import StateGraph, START, END',
          'builder = StateGraph(dict)',
          'print(builder)'
        ]
      },
      {
        problem: 'Define TypedDict AgentState schema for LangGraph state.',
        correctSequence: [
          'from typing import TypedDict, Annotated',
          'import operator',
          'class State(TypedDict):',
          '    messages: Annotated[list, operator.add]',
          'builder = StateGraph(State)',
          'print(State)'
        ],
        availablePool: [
          'from typing import TypedDict, Annotated',
          'import operator',
          'class State(TypedDict):',
          '    messages: Annotated[list, operator.add]',
          'builder = StateGraph(State)',
          'print(State)'
        ]
      },
      {
        problem: 'Add node functions to StateGraph builder using builder.add_node().',
        correctSequence: [
          'from langgraph.graph import StateGraph',
          'builder = StateGraph(State)',
          'builder.add_node("chatbot", chatbot_node)',
          'builder.add_node("tools", tool_node)',
          'print("Nodes added")'
        ],
        availablePool: [
          'from langgraph.graph import StateGraph',
          'builder = StateGraph(State)',
          'builder.add_node("chatbot", chatbot_node)',
          'builder.add_node("tools", tool_node)',
          'print("Nodes added")'
        ]
      },
      {
        problem: 'Connect nodes with direct edges using builder.add_edge().',
        correctSequence: [
          'from langgraph.graph import START, END',
          'builder.add_edge(START, "chatbot")',
          'builder.add_edge("tools", "chatbot")',
          'print("Edges added")'
        ],
        availablePool: [
          'from langgraph.graph import START, END',
          'builder.add_edge(START, "chatbot")',
          'builder.add_edge("tools", "chatbot")',
          'print("Edges added")'
        ]
      },
      {
        problem: 'Add conditional edge routing using builder.add_conditional_edges().',
        correctSequence: [
          'from langgraph.graph import END',
          'builder.add_conditional_edges("chatbot", route_tools, {"tools": "tools", END: END})',
          'print("Conditional edge configured")'
        ],
        availablePool: [
          'from langgraph.graph import END',
          'builder.add_conditional_edges("chatbot", route_tools, {"tools": "tools", END: END})',
          'print("Conditional edge configured")'
        ]
      },
      {
        problem: 'Compile StateGraph into executable app using builder.compile().',
        correctSequence: [
          'app = builder.compile()',
          'res = app.invoke({"messages": [("user", "Hi")]})',
          'print(res)'
        ],
        availablePool: [
          'app = builder.compile()',
          'res = app.invoke({"messages": [("user", "Hi")]})',
          'print(res)'
        ]
      },
      {
        problem: 'Add MemorySaver checkpointer for state persistence.',
        correctSequence: [
          'from langgraph.checkpoint.memory import MemorySaver',
          'memory = MemorySaver()',
          'app = builder.compile(checkpointer=memory)',
          'print(app.invoke({"messages": [("user", "Hi")]}, config={"configurable": {"thread_id": "1"}}))'
        ],
        availablePool: [
          'from langgraph.checkpoint.memory import MemorySaver',
          'memory = MemorySaver()',
          'app = builder.compile(checkpointer=memory)',
          'print(app.invoke({"messages": [("user", "Hi")]}, config={"configurable": {"thread_id": "1"}}))'
        ]
      },
      {
        problem: 'Stream graph events using app.stream().',
        correctSequence: [
          'for event in app.stream({"messages": [("user", "Hi")]}, config={"configurable": {"thread_id": "1"}}):',
          '    print(event)'
        ],
        availablePool: [
          'for event in app.stream({"messages": [("user", "Hi")]}, config={"configurable": {"thread_id": "1"}}):',
          '    print(event)'
        ]
      },
      {
        problem: 'Use Human-in-the-Loop interrupt_before in compile().',
        correctSequence: [
          'app = builder.compile(checkpointer=memory, interrupt_before=["tools"])',
          'print(app.get_state(config))'
        ],
        availablePool: [
          'app = builder.compile(checkpointer=memory, interrupt_before=["tools"])',
          'print(app.get_state(config))'
        ]
      },
      {
        problem: 'Assemble complete LangGraph StateGraph workflow with init_chat_model(), nodes & checkpointer.',
        correctSequence: [
          '!pip install langgraph langchain-openai',
          'from langgraph.graph import StateGraph, START, END',
          'from langgraph.checkpoint.memory import MemorySaver',
          'from langchain.chat_models import init_chat_model',
          'builder = StateGraph(State)',
          'builder.add_node("agent", agent_node)',
          'builder.add_edge(START, "agent")',
          'builder.add_edge("agent", END)',
          'app = builder.compile(checkpointer=MemorySaver())',
          'print(app.invoke({"messages": [("user", "LangGraph Complete")]}, config={"configurable": {"thread_id": "1"}}))'
        ],
        availablePool: [
          '!pip install langgraph langchain-openai',
          'from langgraph.graph import StateGraph, START, END',
          'from langgraph.checkpoint.memory import MemorySaver',
          'from langchain.chat_models import init_chat_model',
          'builder = StateGraph(State)',
          'builder.add_node("agent", agent_node)',
          'builder.add_edge(START, "agent")',
          'builder.add_edge("agent", END)',
          'app = builder.compile(checkpointer=MemorySaver())',
          'print(app.invoke({"messages": [("user", "LangGraph Complete")]}, config={"configurable": {"thread_id": "1"}}))'
        ]
      }
    ]
  },
  {
    id: 10,
    title: 'Multi-Agent Systems',
    topic: 'SupervisorAgent & Sub-Agent Delegation Graph',
    missions: [
      {
        problem: 'Define Supervisor Router schema using init_chat_model().with_structured_output().',
        correctSequence: [
          'from pydantic import BaseModel, Field',
          'from langchain.chat_models import init_chat_model',
          'class Router(BaseModel): next_agent: str = Field(description="Researcher, Coder, or FINISH")',
          'supervisor = init_chat_model("gpt-4o").with_structured_output(Router)',
          'print(supervisor.invoke("Delegate task"))'
        ],
        availablePool: [
          'from pydantic import BaseModel, Field',
          'from langchain.chat_models import init_chat_model',
          'class Router(BaseModel): next_agent: str = Field(description="Researcher, Coder, or FINISH")',
          'supervisor = init_chat_model("gpt-4o").with_structured_output(Router)',
          'print(supervisor.invoke("Delegate task"))'
        ]
      },
      {
        problem: 'Define Research sub-agent node.',
        correctSequence: [
          'def research_node(state):',
          '    res = research_agent.invoke(state)',
          '    return {"messages": [res]}',
          'print("Research node ready")'
        ],
        availablePool: [
          'def research_node(state):',
          '    res = research_agent.invoke(state)',
          '    return {"messages": [res]}',
          'print("Research node ready")'
        ]
      },
      {
        problem: 'Define Coder sub-agent node.',
        correctSequence: [
          'def coder_node(state):',
          '    res = coder_agent.invoke(state)',
          '    return {"messages": [res]}',
          'print("Coder node ready")'
        ],
        availablePool: [
          'def coder_node(state):',
          '    res = coder_agent.invoke(state)',
          '    return {"messages": [res]}',
          'print("Coder node ready")'
        ]
      },
      {
        problem: 'Add sub-agent nodes to Multi-Agent StateGraph builder.',
        correctSequence: [
          'from langgraph.graph import StateGraph',
          'workflow = StateGraph(State)',
          'workflow.add_node("Supervisor", supervisor_node)',
          'workflow.add_node("Researcher", research_node)',
          'workflow.add_node("Coder", coder_node)',
          'print("Multi-agent nodes added")'
        ],
        availablePool: [
          'from langgraph.graph import StateGraph',
          'workflow = StateGraph(State)',
          'workflow.add_node("Supervisor", supervisor_node)',
          'workflow.add_node("Researcher", research_node)',
          'workflow.add_node("Coder", coder_node)',
          'print("Multi-agent nodes added")'
        ]
      },
      {
        problem: 'Connect sub-agents back to Supervisor node.',
        correctSequence: [
          'workflow.add_edge("Researcher", "Supervisor")',
          'workflow.add_edge("Coder", "Supervisor")',
          'print("Back edges connected")'
        ],
        availablePool: [
          'workflow.add_edge("Researcher", "Supervisor")',
          'workflow.add_edge("Coder", "Supervisor")',
          'print("Back edges connected")'
        ]
      },
      {
        problem: 'Add conditional routing edge for Supervisor decision.',
        correctSequence: [
          'from langgraph.graph import END',
          'workflow.add_conditional_edges("Supervisor", lambda x: x["next"], {"Researcher": "Researcher", "Coder": "Coder", "FINISH": END})',
          'print("Router edge configured")'
        ],
        availablePool: [
          'from langgraph.graph import END',
          'workflow.add_conditional_edges("Supervisor", lambda x: x["next"], {"Researcher": "Researcher", "Coder": "Coder", "FINISH": END})',
          'print("Router edge configured")'
        ]
      },
      {
        problem: 'Compile Multi-Agent StateGraph into Swarm application.',
        correctSequence: [
          'swarm_app = workflow.compile()',
          'print(swarm_app)'
        ],
        availablePool: [
          'swarm_app = workflow.compile()',
          'print(swarm_app)'
        ]
      },
      {
        problem: 'Stream multi-agent collaboration thoughts in real-time.',
        correctSequence: [
          'for step in swarm_app.stream({"messages": [("user", "Build AI App")]}):',
          '    print(step)'
        ],
        availablePool: [
          'for step in swarm_app.stream({"messages": [("user", "Build AI App")]}):',
          '    print(step)'
        ]
      },
      {
        problem: 'Add Human-in-the-Loop approval before Coder agent executes.',
        correctSequence: [
          'swarm_app = workflow.compile(interrupt_before=["Coder"])',
          'print("Human approval enabled before Coder execution")'
        ],
        availablePool: [
          'swarm_app = workflow.compile(interrupt_before=["Coder"])',
          'print("Human approval enabled before Coder execution")'
        ]
      },
      {
        problem: 'Assemble complete Multi-Agent Swarm system with Supervisor, Researcher & Coder agents.',
        correctSequence: [
          '!pip install langgraph langchain-openai',
          'from langgraph.graph import StateGraph, START, END',
          'from langchain.chat_models import init_chat_model',
          'workflow.add_edge(START, "Supervisor")',
          'swarm = workflow.compile()',
          'print(swarm.invoke({"task": "Design Multi-Agent Swarm"}))'
        ],
        availablePool: [
          '!pip install langgraph langchain-openai',
          'from langgraph.graph import StateGraph, START, END',
          'from langchain.chat_models import init_chat_model',
          'workflow.add_edge(START, "Supervisor")',
          'swarm = workflow.compile()',
          'print(swarm.invoke({"task": "Design Multi-Agent Swarm"}))'
        ]
      }
    ]
  },
  {
    id: 11,
    title: 'LangSmith Deep Dive (Evals, Monitoring)',
    topic: 'LangSmith Client(), Tracing, Evaluators & Datasets',
    missions: [
      {
        problem: 'Set LangSmith tracing environment variables.',
        correctSequence: [
          'import os',
          'os.environ["LANGCHAIN_TRACING_V2"] = "true"',
          'os.environ["LANGCHAIN_API_KEY"] = "ls__proj_key_101"',
          'print("LangSmith Tracing Enabled")'
        ],
        availablePool: [
          'import os',
          'os.environ["LANGCHAIN_TRACING_V2"] = "true"',
          'os.environ["LANGCHAIN_API_KEY"] = "ls__proj_key_101"',
          'print("LangSmith Tracing Enabled")'
        ]
      },
      {
        problem: 'Initialize LangSmith Client object.',
        correctSequence: [
          '!pip install langsmith',
          'from langsmith import Client',
          'client = Client()',
          'print("LangSmith Client Connected")'
        ],
        availablePool: [
          '!pip install langsmith',
          'from langsmith import Client',
          'client = Client()',
          'print("LangSmith Client Connected")'
        ]
      },
      {
        problem: 'Create benchmark dataset using client.create_dataset().',
        correctSequence: [
          'dataset = client.create_dataset("AI Benchmark", description="LangChain Evals")',
          'print(f"Dataset created ID: {dataset.id}")'
        ],
        availablePool: [
          'dataset = client.create_dataset("AI Benchmark", description="LangChain Evals")',
          'print(f"Dataset created ID: {dataset.id}")'
        ]
      },
      {
        problem: 'Add input/output test examples to dataset.',
        correctSequence: [
          'client.create_examples(inputs=[{"q": "2+2"}], outputs=[{"a": "4"}], dataset_id=dataset.id)',
          'print("Examples added")'
        ],
        availablePool: [
          'client.create_examples(inputs=[{"q": "2+2"}], outputs=[{"a": "4"}], dataset_id=dataset.id)',
          'print("Examples added")'
        ]
      },
      {
        problem: 'Import and run evaluate() benchmark runner.',
        correctSequence: [
          'from langsmith.evaluation import evaluate',
          'results = evaluate(target_fn, data="AI Benchmark", evaluators=[eval_correctness])',
          'print(results)'
        ],
        availablePool: [
          'from langsmith.evaluation import evaluate',
          'results = evaluate(target_fn, data="AI Benchmark", evaluators=[eval_correctness])',
          'print(results)'
        ]
      },
      {
        problem: 'Trace custom function using @traceable decorator.',
        correctSequence: [
          'from langsmith import traceable',
          '@traceable',
          'def my_pipeline(query: str):',
          '    return model.invoke(query)',
          'print(my_pipeline("Trace test"))'
        ],
        availablePool: [
          'from langsmith import traceable',
          '@traceable',
          'def my_pipeline(query: str):',
          '    return model.invoke(query)',
          'print(my_pipeline("Trace test"))'
        ]
      },
      {
        problem: 'Define custom evaluator function returning RunEvalResult.',
        correctSequence: [
          'from langsmith.schemas import Run, Example',
          'from langsmith.evaluation import RunEvalResult',
          'def eval_len(run: Run, example: Example) -> RunEvalResult:',
          '    return RunEvalResult(key="length", score=1.0)',
          'print("Evaluator defined")'
        ],
        availablePool: [
          'from langsmith.schemas import Run, Example',
          'from langsmith.evaluation import RunEvalResult',
          'def eval_len(run: Run, example: Example) -> RunEvalResult:',
          '    return RunEvalResult(key="length", score=1.0)',
          'print("Evaluator defined")'
        ]
      },
      {
        problem: 'Filter errored runs from LangSmith project.',
        correctSequence: [
          'runs = list(client.list_runs(project_name="default", error=True))',
          'print(f"Found {len(runs)} failed runs")'
        ],
        availablePool: [
          'runs = list(client.list_runs(project_name="default", error=True))',
          'print(f"Found {len(runs)} failed runs")'
        ]
      },
      {
        problem: 'Create user feedback score on run.',
        correctSequence: [
          'client.create_feedback(run_id="run_101", key="user_thumbs_up", score=1)',
          'print("Feedback logged")'
        ],
        availablePool: [
          'client.create_feedback(run_id="run_101", key="user_thumbs_up", score=1)',
          'print("Feedback logged")'
        ]
      },
      {
        problem: 'Assemble full LangSmith Evals system with Client, @traceable & evaluate runner.',
        correctSequence: [
          '!pip install langsmith langchain-openai',
          'from langsmith import Client, traceable',
          'from langsmith.evaluation import evaluate',
          'client = Client()',
          '@traceable\ndef predict(x): return model.invoke(x)',
          'results = evaluate(predict, data="AI Benchmark")',
          'print(results)'
        ],
        availablePool: [
          '!pip install langsmith langchain-openai',
          'from langsmith import Client, traceable',
          'from langsmith.evaluation import evaluate',
          'client = Client()',
          '@traceable\ndef predict(x): return model.invoke(x)',
          'results = evaluate(predict, data="AI Benchmark")',
          'print(results)'
        ]
      }
    ]
  },
  {
    id: 12,
    title: 'Production: Reliability, Deployment',
    topic: 'with_fallbacks, with_retry & LangGraph Server',
    missions: [
      {
        problem: 'Attach fallback model using model.with_fallbacks().',
        correctSequence: [
          'from langchain.chat_models import init_chat_model',
          'primary = init_chat_model("gpt-4o", model_provider="openai")',
          'fallback = init_chat_model("claude-3-5-sonnet", model_provider="anthropic")',
          'reliable_model = primary.with_fallbacks([fallback])',
          'print(reliable_model.invoke("Reliable Query").content)'
        ],
        availablePool: [
          'from langchain.chat_models import init_chat_model',
          'primary = init_chat_model("gpt-4o", model_provider="openai")',
          'fallback = init_chat_model("claude-3-5-sonnet", model_provider="anthropic")',
          'reliable_model = primary.with_fallbacks([fallback])',
          'print(reliable_model.invoke("Reliable Query").content)'
        ]
      },
      {
        problem: 'Configure retry policy using model.with_retry().',
        correctSequence: [
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'resilient_model = model.with_retry(stop_after_attempt=3, wait_exponential_jitter=True)',
          'print(resilient_model.invoke("Retry query").content)'
        ],
        availablePool: [
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'resilient_model = model.with_retry(stop_after_attempt=3, wait_exponential_jitter=True)',
          'print(resilient_model.invoke("Retry query").content)'
        ]
      },
      {
        problem: 'Configure langgraph.json deployment config.',
        correctSequence: [
          'import json',
          'config = {"dependencies": ["."], "graphs": {"agent": "./agent.py:graph"}}',
          'print(json.dumps(config, indent=2))'
        ],
        availablePool: [
          'import json',
          'config = {"dependencies": ["."], "graphs": {"agent": "./agent.py:graph"}}',
          'print(json.dumps(config, indent=2))'
        ]
      },
      {
        problem: 'Connect to deployed LangGraph Cloud server using langgraph_sdk get_client().',
        correctSequence: [
          '!pip install langgraph-sdk',
          'from langgraph_sdk import get_client',
          'client = get_client(url="http://localhost:8123")',
          'print("Connected to LangGraph Server")'
        ],
        availablePool: [
          '!pip install langgraph-sdk',
          'from langgraph_sdk import get_client',
          'client = get_client(url="http://localhost:8123")',
          'print("Connected to LangGraph Server")'
        ]
      },
      {
        problem: 'Call model asynchronously using model.ainvoke().',
        correctSequence: [
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'res = await model.ainvoke("Async Query")',
          'print(res.content)'
        ],
        availablePool: [
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'res = await model.ainvoke("Async Query")',
          'print(res.content)'
        ]
      },
      {
        problem: 'Set execution timeout limit using model.bind(timeout=10.0).',
        correctSequence: [
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'timeout_model = model.bind(timeout=10.0)',
          'print(timeout_model.invoke("Timeout Test").content)'
        ],
        availablePool: [
          'from langchain.chat_models import init_chat_model',
          'model = init_chat_model("gpt-4o")',
          'timeout_model = model.bind(timeout=10.0)',
          'print(timeout_model.invoke("Timeout Test").content)'
        ]
      },
      {
        problem: 'Configure PostgresSaver checkpointer for production state persistence.',
        correctSequence: [
          '!pip install langgraph-checkpoint-postgres psycopg',
          'from langgraph.checkpoint.postgres import PostgresSaver',
          'checkpointer = PostgresSaver("postgresql://user:pass@localhost:5432/db")',
          'app = workflow.compile(checkpointer=checkpointer)',
          'print("Postgres Saver configured")'
        ],
        availablePool: [
          '!pip install langgraph-checkpoint-postgres psycopg',
          'from langgraph.checkpoint.postgres import PostgresSaver',
          'checkpointer = PostgresSaver("postgresql://user:pass@localhost:5432/db")',
          'app = workflow.compile(checkpointer=checkpointer)',
          'print("Postgres Saver configured")'
        ]
      },
      {
        problem: 'Configure FastAPI server with CORS middleware for agent deployment.',
        correctSequence: [
          '!pip install fastapi uvicorn',
          'from fastapi import FastAPI',
          'from fastapi.middleware.cors import CORSMiddleware',
          'app = FastAPI()',
          'app.add_middleware(CORSMiddleware, allow_origins=["*"])',
          'print("FastAPI server configured")'
        ],
        availablePool: [
          '!pip install fastapi uvicorn',
          'from fastapi import FastAPI',
          'from fastapi.middleware.cors import CORSMiddleware',
          'app = FastAPI()',
          'app.add_middleware(CORSMiddleware, allow_origins=["*"])',
          'print("FastAPI server configured")'
        ]
      },
      {
        problem: 'Add /health endpoint for Kubernetes liveness probe.',
        correctSequence: [
          'from fastapi import FastAPI',
          'app = FastAPI()',
          '@app.get("/health")',
          'def health(): return {"status": "healthy"}',
          'print("Health probe endpoint added")'
        ],
        availablePool: [
          'from fastapi import FastAPI',
          'app = FastAPI()',
          '@app.get("/health")',
          'def health(): return {"status": "healthy"}',
          'print("Health probe endpoint added")'
        ]
      },
      {
        problem: 'Assemble complete Production Deployment pipeline with fallbacks, retries & init_chat_model().',
        correctSequence: [
          '!pip install langchain langgraph langgraph-checkpoint-postgres',
          'from langchain.chat_models import init_chat_model',
          'from langgraph.checkpoint.postgres import PostgresSaver',
          'primary = init_chat_model("gpt-4o", model_provider="openai")',
          'fallback = init_chat_model("claude-3-5-sonnet", model_provider="anthropic")',
          'resilient_llm = primary.with_fallbacks([fallback]).with_retry(stop_after_attempt=3)',
          'prod_app = workflow.compile(checkpointer=PostgresSaver(conn_str))',
          'print("Production System Verified")'
        ],
        availablePool: [
          '!pip install langchain langgraph langgraph-checkpoint-postgres',
          'from langchain.chat_models import init_chat_model',
          'from langgraph.checkpoint.postgres import PostgresSaver',
          'primary = init_chat_model("gpt-4o", model_provider="openai")',
          'fallback = init_chat_model("claude-3-5-sonnet", model_provider="anthropic")',
          'resilient_llm = primary.with_fallbacks([fallback]).with_retry(stop_after_attempt=3)',
          'prod_app = workflow.compile(checkpointer=PostgresSaver(conn_str))',
          'print("Production System Verified")'
        ]
      }
    ]
  }
];

export default function LangChainCommandRoom({ onBack }) {
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [currentMissionIdx, setCurrentMissionIdx] = useState(0);

  // Live IDE Code Canvas State (Assembled Code Lines)
  const [assembledLines, setAssembledLines] = useState([]);

  const [isRunning, setIsRunning] = useState(false);
  const [executingLogs, setExecutingLogs] = useState([]);
  const [showVictory, setShowVictory] = useState(false);

  // Persistent Completed Level & Lock Tracking
  const getInitialCompletedLevels = () => {
    try {
      const raw = localStorage.getItem('langchain_completed_levels');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  };

  const [completedLevelIds, setCompletedLevelIds] = useState(getInitialCompletedLevels);

  const getInitialMaxUnlocked = () => {
    try {
      const raw = parseInt(localStorage.getItem('langchain_max_unlocked_level') || '1', 10);
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

  const level = LANGCHAIN_SYLLABUS.find((l) => l.id === currentLevelId) || LANGCHAIN_SYLLABUS[0];
  const missions = level?.missions || [];
  const currentMission = missions[currentMissionIdx] || missions[0];

  // Scramble Code Chips Palette
  const scrambledPool = useMemo(() => {
    return shuffleArray(currentMission?.availablePool || []);
  }, [currentLevelId, currentMissionIdx, currentMission]);

  useEffect(() => {
    try { soundManager.init(); soundManager.resume(); } catch (e) {}
    setAssembledLines([]);
    setExecutingLogs([`>>> IDE Code Editor (app.py) Ready. Click code block chips to build your Python script!`]);
    setShowVictory(false);
    setIsRunning(false);
  }, [currentLevelId, currentMissionIdx]);

  // Click Code Chip in Palette to Append to app.py Live Code Canvas
  const handleAddCodeLine = (line) => {
    try { soundManager.playClick(); } catch (e) {}
    setAssembledLines((prev) => [...prev, line]);
  };

  // Remove Code Line from IDE Canvas
  const handleRemoveCodeLine = (idx) => {
    try { soundManager.playClick(); } catch (e) {}
    setAssembledLines((prev) => prev.filter((_, i) => i !== idx));
  };

  // Auto Connect Exact Script Sequence
  const handleAutoConnect = () => {
    try { soundManager.playCollect(); } catch (e) {}
    setAssembledLines(currentMission?.correctSequence || []);
  };

  // Select Level
  const handleSelectLevel = (lvlId) => {
    if (!isLevelUnlocked(lvlId)) {
      try { soundManager.playWrong(); } catch (e) {}
      setExecutingLogs([`🔒 LESSON ${lvlId} IS LOCKED! Complete Lesson ${lvlId - 1} first to unlock.`]);
      return;
    }
    try { soundManager.playClick(); } catch (e) {}
    setCurrentLevelId(lvlId);
    setCurrentMissionIdx(0);
  };

  // Verify Solution Code Script
  const handleVerifySolution = () => {
    if (isRunning) return;

    try {
      try { soundManager.init(); soundManager.resume(); } catch (e) {}

      const userScript = (assembledLines || []).join('\n').replace(/\s+/g, ' ').trim();
      const targetScript = (currentMission?.correctSequence || []).join('\n').replace(/\s+/g, ' ').trim();

      const isCorrect = userScript.length > 0 && userScript === targetScript;

      setIsRunning(true);
      try { soundManager.playNitro(); } catch (e) {}
      setExecutingLogs([`>>> 🦜 EXECUTING PYTHON SCRIPT app.py (MISSION ${currentMissionIdx + 1}/10)...`]);

      let logIdx = 0;
      const logsList = [
        '>>> [python3] Parsing app.py syntax tree...',
        '>>> [init_chat_model] Initializing provider-agnostic ChatModel...',
        '>>> [LCEL Engine] Pipeline stream executed cleanly.',
        `>>> SUCCESS: Mission ${currentMissionIdx + 1}/10 Verified Cleanly!`
      ];

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
              try { soundManager.playLevelComplete(); } catch (e) {}

              if (currentMissionIdx < missions.length - 1) {
                setTimeout(() => {
                  setCurrentMissionIdx((prev) => prev + 1);
                }, 800);
              } else {
                // All 10 missions finished for this level!
                if (!completedLevelIds.includes(currentLevelId)) {
                  const nextCompleted = [...completedLevelIds, currentLevelId];
                  setCompletedLevelIds(nextCompleted);
                  try { localStorage.setItem('langchain_completed_levels', JSON.stringify(nextCompleted)); } catch (e) {}
                }

                const nextUnlocked = Math.max(maxUnlockedLevelId, currentLevelId + 1);
                setMaxUnlockedLevelId(nextUnlocked);
                try { localStorage.setItem('langchain_max_unlocked_level', nextUnlocked.toString()); } catch (e) {}

                setShowVictory(true);
              }
            } else {
              try { soundManager.playWrong(); } catch (e) {}
              setExecutingLogs((prev) => [
                ...prev,
                '⚠️ SYNTAX / PIPELINE MISMATCH: Check app.py code line order or distractor code blocks!',
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
    <div className="langchain-room-container">
      {/* ── Top Header ── */}
      <div className="langchain-header">
        <div className="langchain-title-group">
          <div className="langchain-subtitle" style={{ fontSize: '0.85rem', color: '#00a67e', fontWeight: 800 }}>
            Lesson {level?.id || 1} of 12: {level?.title || ''} — Mission {currentMissionIdx + 1} / 10
          </div>
        </div>

        <div className="langchain-header-controls">
          <button className="langchain-btn-back" onClick={onBack}>
            ← Back to Picker
          </button>

          <button className="langchain-btn-back" onClick={handleAutoConnect} style={{ color: '#00a67e', borderColor: 'rgba(0, 166, 126, 0.4)' }}>
            ⚡ AUTO-CONNECT SCRIPT
          </button>

          <button className="langchain-btn-run" onClick={handleVerifySolution} disabled={isRunning}>
            {isRunning ? '⏳ RUNNING...' : '▶ RUN PYTHON SCRIPT (app.py)'}
          </button>
        </div>
      </div>

      {/* ── Workspace ── */}
      <div className="langchain-workspace">
        {/* Left Sidebar (12-Lesson Syllabus) */}
        <div className="langchain-sidebar">
          <div className="langchain-section-title">12-LESSON SYLLABUS</div>
          <div className="langchain-level-pills">
            {(LANGCHAIN_SYLLABUS || []).map((lvl) => {
              const isCompleted = completedLevelIds.includes(lvl.id);
              const isActive = currentLevelId === lvl.id;
              const unlocked = isLevelUnlocked(lvl.id);

              return (
                <div
                  key={lvl.id}
                  className={`langchain-level-pill ${isActive ? 'active' : isCompleted ? 'completed' : !unlocked ? 'locked' : ''}`}
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

        {/* Center IDE Workspace Area */}
        <div className="langchain-center-area">
          {/* Mission Objective Banner */}
          <div className="langchain-objective-banner">
            <div>
              <span style={{ color: '#00a67e', fontSize: '0.8rem', fontFamily: '"Fira Code", monospace', display: 'block', marginBottom: 2 }}>
                🎯 LESSON {level.id} — MISSION {currentMissionIdx + 1} OF 10 TASK:
              </span>
              <span>📋 {currentMission?.problem || ''}</span>
            </div>
            <div style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(0, 166, 126, 0.2)', color: '#00a67e', fontFamily: '"Fira Code", monospace', fontSize: '0.75rem' }}>
              {currentMissionIdx + 1}/10
            </div>
          </div>

          {/* Dual Panel IDE Studio Grid */}
          <div className="langchain-ide-grid">
            {/* Left Panel: Live Python IDE Code Canvas (app.py) */}
            <div className="langchain-step-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="langchain-step-header">
                <span>🐍 LIVE SCRIPT CANVAS (app.py)</span>
                <button
                  onClick={() => setAssembledLines([])}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  Clear Script ✕
                </button>
              </div>

              <div
                style={{
                  flex: 1,
                  background: '#020806',
                  borderRadius: 10,
                  border: '1px solid rgba(0, 166, 126, 0.3)',
                  padding: 14,
                  fontFamily: '"Fira Code", monospace',
                  fontSize: '0.82rem',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                {assembledLines.length === 0 ? (
                  <div style={{ color: '#64748b', fontStyle: 'italic', padding: 12 }}>
                    # Your Python script (app.py) is empty.<br />
                    # Click code blocks from the right palette to build your script line-by-line!
                  </div>
                ) : (
                  assembledLines.map((line, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleRemoveCodeLine(idx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        borderRadius: 6,
                        background: line.startsWith('#')
                          ? 'rgba(100, 116, 139, 0.15)'
                          : line.startsWith('!')
                          ? 'rgba(245, 158, 11, 0.15)'
                          : 'rgba(0, 166, 126, 0.15)',
                        border: '1px solid',
                        borderColor: line.startsWith('#')
                          ? '#64748b'
                          : line.startsWith('!')
                          ? '#f59e0b'
                          : '#00a67e',
                        color: line.startsWith('#')
                          ? '#94a3b8'
                          : line.startsWith('!')
                          ? '#f59e0b'
                          : '#38bdf8',
                        cursor: 'pointer',
                        lineHeight: 1.4,
                      }}
                    >
                      <div style={{ display: 'flex', gap: 10 }}>
                        <span style={{ color: '#64748b', width: 20 }}>{idx + 1}.</span>
                        <span>{line}</span>
                      </div>
                      <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>✕</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Panel: Available Code Chips Palette */}
            <div className="langchain-step-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="langchain-step-header">
                <span>🧩 CODE BLOCKS PALETTE (SCRAMBLED - CLICK TO ADD):</span>
              </div>

              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                {scrambledPool.map((line, idx) => {
                  const isUsed = assembledLines.includes(line);
                  return (
                    <div
                      key={idx}
                      className={`langchain-widget-chip ${isUsed ? 'used' : ''}`}
                      onClick={() => !isUsed && handleAddCodeLine(line)}
                      style={{
                        padding: '8px 12px',
                        fontFamily: '"Fira Code", monospace',
                        fontSize: '0.8rem',
                        lineHeight: 1.4,
                        textAlign: 'left',
                      }}
                    >
                      {line}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Console Terminal Output ── */}
      <div className="langchain-terminal">
        <div className="langchain-logs-container">
          {executingLogs.map((log, idx) => (
            <div key={idx} className={`langchain-log-line ${log?.includes('SUCCESS') ? 'langchain-log-success' : ''}`}>
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* ── Victory Celebration Modal ── */}
      {showVictory && (
        <div className="langchain-modal-overlay">
          <div className="langchain-modal-card">
            <div style={{ fontSize: '3.5rem' }}>🎉 🦜🔗</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#00a67e', margin: 0 }}>
              LESSON {level?.id || 1} ALL 10 MISSIONS COMPLETED!
            </h2>
            <div style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
              You successfully mastered <strong>{level?.title || ''}</strong>!
            </div>
            <div style={{ display: 'flex', gap: 6, fontSize: '1.5rem', margin: '8px 0' }}>
              ⭐ ⭐ ⭐ ⭐ ⭐
            </div>

            <button
              className="langchain-btn-run"
              onClick={() => {
                if (currentLevelId < LANGCHAIN_SYLLABUS.length) {
                  setCurrentLevelId((prev) => prev + 1);
                  setCurrentMissionIdx(0);
                } else {
                  onBack();
                }
              }}
            >
              {currentLevelId < LANGCHAIN_SYLLABUS.length ? 'NEXT LESSON ➔' : 'BACK TO MENU'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
