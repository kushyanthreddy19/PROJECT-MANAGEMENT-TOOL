const { generateUserStories } = require('../services/groqService');
const { UserStory, Task } = require('../models');

exports.generateUserStoriesForProject = async (req, res) => {
  const { projectDescription, projectId } = req.body;
  if (!projectDescription || !projectId) {
    return res.status(400).json({ message: 'projectDescription and projectId are required' });
  }

  try {
    const stories = await generateUserStories(projectDescription);

    const created = await Promise.all(stories.map(text =>
      UserStory.create({ content: text, projectId })
    ));

    await Promise.all(created.map(us =>
      Task.create({ title: us.content, description: us.content, status: 'toDo', projectId, assignedTo: null })
    ));

    res.json(stories);
  } catch (error) {
    console.error('Groq error:', error);
    res.status(500).json({ message: 'Failed to generate user stories' });
  }
};