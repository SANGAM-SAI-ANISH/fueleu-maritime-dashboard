# **Reflection on AI-Assisted Development**

## **Learning Experience with AI Agents**

This project was my first extensive use of AI agents for a full-stack assignment with strict architectural constraints. I learned that while AI is incredibly powerful at generating boilerplate and solving isolated logical problems, it requires careful "steering" to adhere to specific patterns like Hexagonal Architecture.

I discovered that specificity in prompting is paramount. When I asked for "a backend," I got a generic MVC structure. But when I prompted for "Hexagonal Architecture with a core domain free of dependencies," the agent generated exactly what was required. I also learned to use the agent as a "regulatory consultant"—uploading the ESSF PDF allowed the agent to extract complex formulas (like the VLSFO penalty conversion) faster and more accurately than I could have manually.

## **Efficiency Gains vs. Manual Coding**

The efficiency gains were most notable in three areas:

1. **Mathematical Implementation:** Implementing the GHG Intensity formula manually would have required cross-referencing 4-5 tables in the PDF. The agent ingested the document and generated the ComplianceService logic in seconds, saving hours of reading time.  
2. **UI Prototyping:** Building the React/Tailwind dashboard manually usually takes me 3-4 hours to get the styling right. With AI, I generated a production-grade "Glassmorphism" UI in under 20 minutes.  
3. **Debugging:** When I encountered the Prisma version conflict (v7 vs v5), the agent immediately identified the breaking change and provided a specific downgrade command, saving me from a potentially long "StackOverflow rabbit hole."

However, manual coding was still superior for connecting the pieces. The AI struggled to understand my specific local environment (missing folders, PowerShell permissions), requiring me to manually intervene and run initialization commands.

## **Future Improvements**

Next time, I would improve my workflow by:

1. **Incremental Context Feeding:** Instead of uploading all screenshots at once, I would feed the requirements module-by-module (e.g., "First, let's build the Core Domain based on this image"). This might reduce the minor hallucinations I saw in the initial pooling logic.  
2. **Test-Driven Generation:** I would ask the agent to generate the *tests* first based on the PDF examples, and *then* write the code to pass those tests. This would ensure even higher regulatory accuracy from the start.  
3. **Docker Integration:** I would ask the agent to generate a docker-compose file early on to standardize the database environment, avoiding the local SQLite/Postgres confusion entirely.