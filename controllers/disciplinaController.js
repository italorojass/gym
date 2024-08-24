const { executeQuery } = require('../conexions/database');
const { connectToDatabase } = require('../conexions/database');

const getDisciplinas = async (req, res) => {
    const query = `CALL obtener_disciplinas()`;
    try {
      const [resultQuery] = await executeQuery(query);
  
      res.status(200).json(resultQuery);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las disciplinas', error });
    }
  }
  

  async function agregarDisciplina(req, res) {
    const { nombre_disciplina, descripcion_disciplina, instructor_id, dias, horarios } = req.body;
    try {
        // Llamar al procedimiento almacenado
        const [results] = await executeQuery(
            `CALL agregar_disciplina(?, ?, ?, ?, ?)`,
            [ nombre_disciplina, 
                descripcion_disciplina, 
                JSON.stringify(instructor_id), 
                JSON.stringify(dias), 
                JSON.stringify(horarios)]
        );

        // Responder con el resultado
        res.status(200).json({
            message: 'Disciplina agregada con éxito',
            data: results
        });
    } catch (error) {
        console.error('Error al agregar la disciplina:', error);
        res.status(500).json({
            message: 'Error al agregar la disciplina',
            error: error.message
        });
    } finally {
        await connection.end();
    }
}

const updateDisciplina = async (req, res) => {
    const { disciplinaId, nombre, descripcion, estado, instructores, dias, horarios } = req.body;

    try {
        // Comenzamos una transacción para asegurar la integridad de los datos
        await executeQuery('START TRANSACTION', []);

        // Actualiza la disciplina
        const queryUpdateDisciplina = 'UPDATE Disciplinas SET nombre = ?, descripcion = ?, estado = ? WHERE id = ?';
        await executeQuery(queryUpdateDisciplina, [nombre, descripcion, estado, disciplinaId]);

        // Actualizar los instructores asociados
        await executeQuery('DELETE FROM Disciplina_Instructor WHERE disciplina_id = ?', [disciplinaId]);
        for (let instructorId of instructores) {
            const queryInstructor = 'INSERT INTO Disciplina_Instructor (disciplina_id, instructor_id) VALUES (?, ?)';
            await executeQuery(queryInstructor, [disciplinaId, instructorId]);
        }

        // Actualizar los días asociados
        await executeQuery('DELETE FROM Disciplina_Dia WHERE disciplina_id = ?', [disciplinaId]);
        for (let diaId of dias) {
            const queryDia = 'INSERT INTO Disciplina_Dia (disciplina_id, dia_id) VALUES (?, ?)';
            await executeQuery(queryDia, [disciplinaId, diaId]);
        }

        // Actualizar los horarios asociados
        await executeQuery('DELETE FROM Disciplina_Horario WHERE disciplina_id = ?', [disciplinaId]);
        for (let horarioId of horarios) {
            const queryHorario = 'INSERT INTO Disciplina_Horario (disciplina_id, horario_id) VALUES (?, ?)';
            await executeQuery(queryHorario, [disciplinaId, horarioId]);
        }

        // Confirma la transacción
        await executeQuery('COMMIT', []);

        res.status(200).json({ message: 'Disciplina actualizada exitosamente' });
    } catch (error) {
        // En caso de error, revertimos la transacción
        await executeQuery('ROLLBACK', []);
        res.status(500).json({ message: 'Error al actualizar la disciplina', error });
    }
};
  module.exports = {
    getDisciplinas,
    agregarDisciplina,
    updateDisciplina
  }