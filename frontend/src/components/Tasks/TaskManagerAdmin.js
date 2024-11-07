import React, { useState } from "react";
import {
  Box,
  Text,
  Input,
  Button,
  IconButton,
  VStack,
  HStack,
  Select,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const TaskManagerAdmin = ({
  selectedChat,
  handlePhaseSubmit,
  handleTaskSubmit,
}) => {
  const [phases, setPhases] = useState([]);
  const [newPhaseName, setNewPhaseName] = useState("");
  const [newTask, setNewTask] = useState({
    name: "",
    assignedTo: "",
    assignedToName: "",
    dueDate: "",
  });
  const [activePhaseIndex, setActivePhaseIndex] = useState(null);

  // Add a new phase and reset the input field
  const addPhase = () => {
    if (newPhaseName.trim() !== "") {
      const phase = { name: newPhaseName, tasks: [] };
      setPhases([...phases, phase]);
      setNewPhaseName("");
      handlePhaseSubmit(phase); // Backend call to save new phase
    }
  };

  // Add a task to the active phase
  const addTask = (phaseIndex) => {
    if (newTask.name.trim()) {
      const updatedPhases = [...phases];
      const task = { ...newTask };
      updatedPhases[phaseIndex].tasks.push(task);
      setPhases(updatedPhases);

      // Reset new task form and set active phase index to null
      setNewTask({ name: "", assignedTo: "", assignedToName: "", dueDate: "" });
      setActivePhaseIndex(null);

      // Call backend to save the new task within the phase
      handleTaskSubmit(task, updatedPhases[phaseIndex].name);
    }
  };

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold">
        Admin Task Manager
      </Text>

      {/* Phase Creation with "+" Button */}
      <Box mt={4} display="flex" alignItems="center">
        <Text fontSize="lg">Phases</Text>
        <IconButton
          icon={<AddIcon />}
          colorScheme="blue"
          ml={2}
          onClick={() => setActivePhaseIndex("new")}
          aria-label="Add Phase"
          size="sm"
        />
      </Box>

      {/* Conditional Input to Add New Phase */}
      {activePhaseIndex === "new" && (
        <Box mt={2} display="flex" alignItems="center">
          <Input
            placeholder="Enter phase name"
            value={newPhaseName}
            onChange={(e) => setNewPhaseName(e.target.value)}
            mr={2}
          />
          <Button colorScheme="blue" onClick={addPhase}>
            Add Phase
          </Button>
        </Box>
      )}

      {/* Phases with Small "+" Button for Adding Tasks */}
      <VStack align="start" spacing={4} mt={6}>
        {phases.map((phase, index) => (
          <Box
            key={index}
            p={4}
            border="1px solid lightgray"
            borderRadius="md"
            w="full"
          >
            <HStack>
              <Text fontSize="lg" fontWeight="bold">
                {phase.name}
              </Text>
              <IconButton
                icon={<AddIcon />}
                size="xs"
                colorScheme="teal"
                onClick={() => setActivePhaseIndex(index)}
                aria-label="Add Task"
              />
            </HStack>

            {/* Task Creation Form for the Active Phase */}
            {activePhaseIndex === index && (
              <Box mt={2}>
                <Input
                  placeholder="Task Name"
                  value={newTask.name}
                  onChange={(e) =>
                    setNewTask({ ...newTask, name: e.target.value })
                  }
                  mt={2}
                />
                <Select
                  placeholder="Assign To"
                  value={newTask.assignedTo}
                  onChange={(e) => {
                    const selectedUserId = e.target.value;
                    const selectedUser = selectedChat.users.find(
                      (user) => user._id === selectedUserId
                    );
                    setNewTask({
                      ...newTask,
                      assignedTo: selectedUserId,
                      assignedToName: selectedUser.name,
                    });
                  }}
                  mt={2}
                >
                  {selectedChat.users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </Select>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                  mt={2}
                />
                <Button
                  colorScheme="teal"
                  mt={2}
                  onClick={() => addTask(index)}
                >
                  Add Task to {phase.name}
                </Button>
              </Box>
            )}

            {/* Display Tasks within Each Phase */}
            <Box mt={4}>
              <Text fontSize="md" fontWeight="bold">
                Tasks in {phase.name}
              </Text>
              {phase.tasks.length > 0 ? (
                phase.tasks.map((task, i) => (
                  <Box
                    key={i}
                    p={2}
                    mt={2}
                    border="1px solid lightgray"
                    borderRadius="md"
                  >
                    <Text>
                      <strong>Task:</strong> {task.name}
                    </Text>
                    <Text>
                      <strong>Assigned To:</strong> {task.assignedToName}
                    </Text>{" "}
                    {/* Display the assigned user's name */}
                    <Text>
                      <strong>Due Date:</strong> {task.dueDate}
                    </Text>
                  </Box>
                ))
              ) : (
                <Text color="gray.500">No tasks added yet.</Text>
              )}
            </Box>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default TaskManagerAdmin;
